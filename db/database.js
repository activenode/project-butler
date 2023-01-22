const {
   ProjectCollectionResult,
   InstantProjectResult,
   AliasesAlreadyTakenError,
   ProjectAddSuccess,
} = require("./dbResultModels");

const { log, logErr } = require("../utils/log");
const { ProjectOrchestrator } = require("./project/projectOrchestrator");

module.exports.ProjectDatabase = class {
   /**
    * @param {Object} fileHandler - io object with read/write option
    */
   constructor(fileHandler) {
      this.fileHandler = fileHandler;
   }

   async fetchAll() {
      await this._load();
      return new ProjectCollectionResult(this._projectOrchestrator.projects);
   }

   async getExactProjectResultByIdentifier(identifier) {
      await this._load();
      const targetProject = this._projectOrchestrator.getProject(identifier);

      if (targetProject) {
         return new InstantProjectResult(targetProject);
      } else {
         throw new Error(
            `Tried to fetch an exact project by a presumably existing identifier ${identifier} but could not find anything`
         );
      }
   }

   async findBestMatch(searchString) {
      log({ searchString });
      try {
         return await this.getExactProjectResultByIdentifier(searchString);
      } catch {
         return new ProjectCollectionResult(
            this._projectOrchestrator.getProjectsByFragment(searchString)
         );
      }
   }

   /**
    * Adds a project with its aliases
    * @param {String} absPath
    * @param {Array<String>} aliases
    */
   async addProject(absPath, aliases) {
      await this._load();
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
      return new ProjectAddSuccess(addedProject);
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
    * Will save async ll data to the file by simply stringifying it
    * @return {Promise<Object>} promise with the data of the saved object
    */
   async _save() {
      await this.fileHandler.write(this._projectOrchestrator.getJsonData());
   }

   /**
    * @description will read the file-contents and parse it to an object.
    * If no file contents are given it will provide an empty valid struct object.
    * @param {Boolean} bForceFileLoad - if true then a file io will be enforced
    * @return {Promise<String>}
    */
   async _load() {
      if (this._projectOrchestrator) {
         return;
      }
      let rawData;
      try {
         rawData = await this.fileHandler.read();
      } catch (error) {}

      this._projectOrchestrator = new ProjectOrchestrator(rawData);
   }
};
