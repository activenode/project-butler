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
    }

    debug() {
        // await this.lastRead;
        this.lastRead.then(_=>{
            log('-------------------');
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
        Object.keys(dataStruct.projects.quickRef).forEach((projectKey, index)=>{
            const [directoryName, absPath] = projectKey.split(PATH_DELIMITER);
            this.indexToProject.set(index, {
                absPath: absPath,
                directoryName: directoryName
            });

            this.absPathToIndex.set(absPath, index);
            dataStruct.projects.quickRef[projectKey].aliases.forEach(alias=>this.aliasesToIndex.set(alias, index));
        })
        return dataStruct;
    }

    findBestMatch(searchString) {
        throw new Error('NotYetImplemented');
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

        // console.log('path', absPath);
        // console.log('directoryName', directoryName);
        // console.log('aliases', aliases);

        return this.lastRead.then(obj=>{
            obj.projects.quickRef[uid] = { "aliases": aliases };
            return obj;
        }).then(data=>this.parseData(data))
        .then(this.save());
        // .then(log.json).then(()=>this.debug());
        
    }

    
}

module.exports = function(fileIO, pathSeparator){
    return new Database(fileIO, pathSeparator);
};