class ProjectAddSuccess {
   constructor(projectDetails) {
      this._projectDetails = projectDetails;
   }

   get projectDetails() {
      return this._projectDetails;
   }
}

class ProjectUpdateSuccess {
   constructor(projectDetails) {
      this._projectDetails = projectDetails;
   }

   get projectDetails() {
      return this._projectDetails;
   }
}

class ProjectCollectionResult {
   constructor(projects) {
      this._projects = projects;
   }

   get projects() {
      return this._projects;
   }

   isEmpty() {
      return this._projects.length === 0;
   }
}

class InstantProjectResult {
   constructor(project) {
      if ("absPath" in project) {
         this._project = project;
      } else if (
         project instanceof ProjectCollectionResult &&
         !project.isEmpty()
      ) {
         this._project = project.projects[0];
      } else {
         throw new Error(
            "Invalid object provided to constructor of InstantProjectResult"
         );
      }
   }

   get project() {
      return this._project;
   }
}

module.exports = {
   ProjectAddSuccess,
   ProjectUpdateSuccess,
   ProjectCollectionResult,
   InstantProjectResult,
};
