const {
    ErrorResult,
    ProjectListResult,
    ExactProjectResult,
    AddedResult,
} = require('./structs');
let log                 = function(){console.log(Array.from(arguments))};
log.json                = _logdata=>log(JSON.stringify(_logdata));
const PATH_DELIMITER    = ':';
const EMPTY_STRUCT      = { 'projects': {quickRef: {}}, '_settings': { '_i' : 0 } };

function err(error) {
    let errorResult =(new ErrorResult()).addError(error);
}


class ProjectDatabase {
    /**
     * @param {Object} fileIO - io object with read/write option
     * @param {String} pathSeparator - The os-dependend separator
     */
    constructor( fileIO, pathSeparator ) {
        if (!pathSeparator) throw new Error('pathSeparator needs to be defined');

        this.fileIO = fileIO;
        this.pathSeparator = pathSeparator;
        this.lastRead = null; //initializing it for readability reasons. will be overwritten w/ next line
        this.load(true); //will call the read() function on fileIO and write on lastRead
        this.setupEmptyMaps();
    }

    setupEmptyMaps() {
        this.indexToProject = new Map(); 
        //backmapping to indexes to reference projects
        this.aliasesToIndex = new Map();
        this.absPathToIndex = new Map();
        this.uidToIndex     = new Map();
    }

    /**
     * Will output aliases and projects
     */
    async debug() {
        await (this.load());
        log('-------------------');
        this.aliasesToIndex.forEach((key, value)=>{
            log(`Alias [${value}] mapped to ${this.indexToProject.get(key).absPath}`);
        });

        log('');
        log('-------------------');
        let uids = this.uidToIndex.keys();
        let curr = uids.next();
        while (!curr.done) {
            log(await (this.getProjectDetailsByUID(curr.value)));
            curr = uids.next();
        }
    }

    /**
     * Will fetch all available projects
     * @return {Promise<ProjectListResult>} 
     */
    async fetchAll() {
        await (this.load());
        const uids = Array.from(this.uidToIndex.keys());
        return Promise.all(uids.map(uid=>this.getProjectDetailsByUID(uid)))
            .then(projectDetailsArray=>new ProjectListResult(projectDetailsArray))
            .catch(err);
    }

    /**
     * Will save all data to the file by simply stringifying it
     * @return {Promise<Object>} promise with the data of the saved object
     */
    save() {
        return (newDataObj)=>{
            return this.fileIO.write(JSON.stringify(newDataObj)).then(_=>{
                //ensuring that access to lastRead will deal with the new data 
                this.lastRead = Promise.resolve(newDataObj);  //-> instead of this.load() => perf+
                return newDataObj
            })
        };
    }

    /**
     * @description will read the file-contents and parse it to an object. 
     * If no file contents are given it will provide an empty valid struct object.
     * @param {Boolean} bForceFileLoad - if true then a file io will be enforced
     * @return {Promise<String>}
     */
    load(bForceFileIO) {
        if (!bForceFileIO && this.lastRead) return this.lastRead;

        this.lastRead = this.fileIO.read().then(contents=>{
            if (!contents) throw new Error('No content yet');
            return JSON.parse(contents);
        }).catch(readError=>{
            return EMPTY_STRUCT;
        }).then(data=>this.parseData(data));

        return this.lastRead;
    }

    /**
     * @description generates unique Id by absPath and directoryName
     * @param {String} absPath
     * @param {String} directoryName
     */
    uid(absPath, directoryName) {
        return `${directoryName}${PATH_DELIMITER}${absPath}`;
    }

    /**
     * parseData will make sure that the project object 
     * is mapped to the temporary storage and easily accessible.
     * @param {Object} dataStruct 
     */
    parseData ( dataStruct ) {
        Object.keys(dataStruct.projects.quickRef).forEach((uid, index)=>{
            const [directoryName, absPath] = uid.split(PATH_DELIMITER);
            this.indexToProject.set(index, {
                absPath: absPath,
                directoryName: directoryName
            });

            this.uidToIndex.set(uid, index);
            this.absPathToIndex.set(absPath, index);
            dataStruct.projects.quickRef[uid].aliases.forEach(alias=>this.aliasesToIndex.set(alias, index));
        })
        return Promise.resolve(dataStruct);
    }

    /**
     * @description Will return all project-related data via uid of the project
     * @return {Promise<Object>} 
     */
    async getProjectDetailsByUID(uid) {
        return this.load().then(({projects: {quickRef}})=>{
            let projectData = this.indexToProject.get(this.uidToIndex.get(uid));
            projectData.aliases =  quickRef[uid].aliases;
            return projectData;
        })
    }

    findNextBestMatch(searchString) {
        return new ProposalMatch();
    }

    findBestMatch(searchString) {
        //examples:
        // 1. search string: emb
        // -> result: test-emb-test/ from absPath mapping should be matched.
        // -> if multiple matches are available then list and ask to specify term
        return this.load().then(_=>{
            if (this.aliasesToIndex.has(searchString)) {
                return new ExactProjectResult(this.indexToProject.get(this.aliasesToIndex.get(searchString)));
            }

            return this.findNextBestMatch(searchString);
        });
    }

    /**
     * @desc checks given aliases and maps it to its project directories if existing
     * @param {Array<String>} aliases
     * @param {Object} options - excludePath can be set to ignore aliases with this path
     * @return {Promise<Array<String>>}
     */
    async mapExistingAliasesWithProjectDirs(aliasesArray, options) {
        await (this.load());
        options = options || {};
        if (!Array.isArray(aliasesArray)) {
            throw new Error('Please provide an array of aliases');
        }

        const aliasesInUse = aliasesArray
            .filter(alias=>this.aliasesToIndex.has(alias))
            .map(alias=>{
                const {absPath} = this.indexToProject.get(this.aliasesToIndex.get(alias))
                return (options.excludePath && absPath===options.excludePath) ? null : {alias: alias, absPath: absPath};
            })
            .filter(obj=>obj!==null);
        return (aliasesInUse.length > 0) ? aliasesInUse : null;
    }

    /**
     * Adds a project with its aliases 
     * @param {String} absPath 
     * @param {Array<String>} aliases 
     */
    async addProject(absPath, aliases) {
        //addProject(..) will add directoryName as alias automatically if the alias is not yet occupied
        const directoryName = absPath.split(this.pathSeparator).pop();
        const uid = this.uid(absPath, directoryName);

        const aliasesInUse = await this.mapExistingAliasesWithProjectDirs(aliases, {excludePath: absPath});

        if (aliasesInUse) {
            return (new ErrorResult())
                .addError(
                    `The following aliases are already in use`, 
                    aliasesInUse.map(aliasObj=>`${aliasObj.alias} => ${aliasObj.absPath}`)
                );
        }

        //----else:------------
        const result = new AddedResult();

        return this.load(true).then(obj=>{
            let aliasesToWrite = [];
            if (obj.projects.quickRef[uid]) {
                result.addWarning('Info: Project already exists, will merge the definitions now.');
                aliasesToWrite = [].concat(obj.projects.quickRef[uid].aliases)

                aliases.forEach(alias=>{
                    if (!aliasesToWrite.includes(alias)) {
                        aliasesToWrite.push(alias);
                    }
                });
            }

            obj.projects.quickRef[uid] = { "aliases": aliasesToWrite };
            return this.parseData(obj)
                .then(this.save())
                .then(()=>this.getProjectDetailsByUID(uid))
                .then(projectDetails=>result.saveProjectDetails(projectDetails));
        })
    }
}

module.exports = function (fileIO, pathSeparator) {
    return new ProjectDatabase(fileIO, pathSeparator);
};