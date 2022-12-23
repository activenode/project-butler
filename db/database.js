const {
   ProjectCollectionResult,
   InstantProjectResult,
   AliasesAlreadyTakenError,
} = require("./dbResultModels");

const { log, logErr } = require("../utils/log");
const { ProjectOrchestrator } = require("./project/projectOrchestrator");

class ProjectDatabase {
   /**
    * @param {Object} fileHandler - io object with read/write option
    * @param {String} pathSeparator - The os-dependend separator
    */
   constructor(fileHandler, pathSeparator) {
      if (!pathSeparator) throw new Error("pathSeparator needs to be defined");

      this.fileHandler = fileHandler;
      this.pathSeparator = pathSeparator;
      this._load(); // load from file
   }

   async fetchAll() {
      await this._load();
      return new ProjectCollectionResult(this._projectOrchestrator.projects);
   }

   async getExactProjectResultByAlias(sAlias) {
      try {
         const targetProject = this.getExactProjectResultByIdentifier(sAlias);
         // single return and make it very clear!
         return new InstantProjectResult(targetProject);
      } catch (error) {
         throw new Error(
            `Tried to fetch an exact project by a presumably existing alias ${sAlias} but could not find anything`
         );
      }
   }

   getExactProjectResultByAbsoluteDirectory(sAbsoluteDirectoryPath) {
      const targetProject = this.getExactProjectResultByIdentifier(
         sAbsoluteDirectoryPath
      );
      return targetProject && new ProjectCollectionResult(targetProject);
   }

   async getExactProjectResultByIdentifier(identifier) {
      await this._load();
      const targetProject = this._projectOrchestrator.getProject(identifier);

      if (targetProject) {
         return targetProject;
      } else {
         throw new Error(
            `Tried to fetch an exact project by a presumably existing identifier ${identifier} but could not find anything`
         );
      }
   }

   findBestMatch(searchString) {
      log({ searchString });
      //examples:
      // 1. search string: emb
      // -> result: test-emb-test/ from absPath mapping should be matched.
      // -> if multiple matches are available then list and ask to specify term
      return this._load().then(() => {
         try {
            return this.getExactProjectResultByAlias(searchString);
         } catch {
            return this._findNextBestMatch(searchString);
         }
      });
   }

   /**
    * Adds a project with its aliases
    * @param {String} absPath
    * @param {Array<String>} aliases
    */
   addProject(absPath, aliases) {
      const addedProject = this._projectOrchestrator.addProject(
         absPath,
         ...aliases
      );

      if (!addedProject) {
         return new AliasesAlreadyTakenError([], {
            absPath,
            aliases,
         });
      }

      this._save();
   }

   removeProject(identfiers) {
      const deletedProjects = new ProjectCollectionResult(
         identfiers.map((alias) =>
            this._projectOrchestrator.removeProject(alias)
         )
      );
      this._save();
      return deletedProjects;
   }

   /**
    * Will save all data to the file by simply stringifying it
    * @return {Promise<Object>} promise with the data of the saved object
    */
   _save() {
      return this.fileHandler.write(this._projectOrchestrator.getJsonData());
   }

   /**
    * @description will read the file-contents and parse it to an object.
    * If no file contents are given it will provide an empty valid struct object.
    * @param {Boolean} bForceFileLoad - if true then a file io will be enforced
    * @return {Promise<String>}
    */
   _load() {
      if (this._projectOrchestrator) {
         return;
      }
      this.fileHandler.read().then((contents) => this._parseData(contents));
   }

   /**
    * parseData will make sure that the project object
    * is mapped to the temporary storage and easily accessible.
    * @param {Object} dataStruct
    */
   _parseData(dataStruct) {
      this._projectOrchestrator = new ProjectOrchestrator(dataStruct);
   }

   /**
    * Will search for a best match. E.g. `cl` would match `cli` and return an exact
    * but if there is `cli` and `cla` then it would just return Proposals
    * @param {string} searchString
    */
   _findNextBestMatch(searchString) {
      return this.fetchAll().then((allProjects) => {
         if (!(allProjects instanceof ProjectCollectionResult)) {
            logErr(
               `Tried to fetch all projects to find the next best match but failed doing so cause the result was not a collection`
            );
            return [];
         }

         const matchedProjects =
            this._projectOrchestrator.includes(searchString);

         return new ProjectCollectionResult(matchedProjects);
      });
   }
}

module.exports = function hydrateDatabase(fileHandler, pathSeparator) {
   return new ProjectDatabase(fileHandler, pathSeparator);
};
