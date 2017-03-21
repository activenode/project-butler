const EMPTY_STRUCT = { 'projects': {quickRef: {}} };
const PATH_DELIMITER = ':';

class Database {
    constructor( fileIO ) {
        this.fileIO = fileIO;
        this.load();
        
        this.indexToProject = new Map(); //only for back-reference of quick-access
        this.aliasesToIndex = new Map();
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

            dataStruct.projects.quickRef[projectKey].aliases.forEach(alias=>this.aliasesToIndex.set(alias, index));
        })
        return dataStruct;
    }

    addProject(absPath, directoryName, aliases) {
        //addProject(..) will add directoryName as alias automatically if the alias is not yet occupied
        const uid = `${directoryName}${PATH_DELIMITER}${absPath}`;

        return this.lastRead.then(obj=>{
            console.log('obj', obj);
            console.log(this.indexToProject);
            console.log(this.aliasesToIndex);
        })
    }

    
}

module.exports = function(fileIO){
    return new Database(fileIO);
};