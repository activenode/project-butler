const { 
    Result,
    ResultMatch,
    ProposalMatch
} = require('./structs');
const EMPTY_STRUCT      = { 'projects': {quickRef: {}}, '_settings': { '_i' : 0 } };
const PATH_DELIMITER    = ':';
let log                 = function(){console.log(Array.from(arguments))};
log.json                = _logdata=>log(JSON.stringify(_logdata));



class Database {
    constructor( fileIO, pathSeparator ) {
        if (!pathSeparator) throw new Error('pathSeparator needs to be defined');

        this.fileIO = fileIO;
        this.pathSeparator = pathSeparator;
        this.lastRead = null; //initializing it for readability reasons. will be overwritten w/ next line
        this.load();
        
        this.indexToProject = new Map(); //only for back-reference of quick-access
        this.aliasesToIndex = new Map();
        this.absPathToIndex = new Map();
        this.uidToIndex     = new Map();
    }

    debug() {
        // await this.lastRead;
        this.lastRead.then(_=>{
            log('-------------------');
            this.aliasesToIndex.forEach((key, value)=>{
                log(`Alias [${value}] mapped to ${this.indexToProject.get(key).absPath}`);
            })
        })
        
    }

    /**
     * Will save all data to the file by simply stringifying it
     * @return Function - func that can be chained in promise
     */
    save() {
        return (newDataObj)=>{
            console.log('beforeSave', JSON.stringify(newDataObj));

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
     * @return Promise<String>
     */
    load() {
        this.lastRead = this.fileIO.read().then(contents=>{
            if (!contents) throw new Error('No content yet');
            return JSON.parse(contents);
        }).catch(readError=>{
            return EMPTY_STRUCT;
        }).then(data=>this.parseData(data));

        return this.lastRead;
    }

    safeCall(func) {
        if (!this.lastRead) {
            this.load();
        }
        return this.lastRead.then(func);
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
    getProjectDetailsByUID(uid) {
        return this.safeCall(({projects: {quickRef}})=>{
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
        return this.safeCall(_=>{
            if (this.aliasesToIndex.has(searchString)) {
                return new ResultMatch(this.indexToProject.get(this.aliasesToIndex.get(searchString)));
            }

            return this.findNextBestMatch(searchString);
        });
    }

    /**
     * Adds a project with its aliases 
     * @param {String} absPath 
     * @param {Array<String>} aliases 
     */
    addProject(absPath, aliases) {
        //addProject(..) will add directoryName as alias automatically if the alias is not yet occupied
        const directoryName = absPath.split(this.pathSeparator).pop();
        const uid = this.uid(absPath, directoryName);

        const result = new Result();

        return this.lastRead.then(obj=>{
            let aliasesToWrite = [].concat(obj.projects.quickRef[uid].aliases);
            if (obj.projects.quickRef[uid]) {
                result.addWarning('Info: Project already exists, will merge the definitions now.');

                aliases.forEach(alias=>{
                    if (!aliasesToWrite.includes(alias)) {
                        aliasesToWrite.push(alias);
                    }
                }) 
            }

            obj.projects.quickRef[uid] = { "aliases": aliasesToWrite };
            return this.parseData(obj)
                .then(this.save())
                .then(()=>this.getProjectDetailsByUID(uid))
                .then(projectDetails=>result.setResultData(projectDetails));
        })
    }

    
}

module.exports = function(fileIO, pathSeparator){
    return new Database(fileIO, pathSeparator);
};