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
      return this.projects.length === 0;
   }

   isSingleResult() {
      return this.projects.length === 1;
   }

   getFirstResult() {
      return this.projects[0];
   }
}

class InstantProjectResult {
   constructor(project) {
      if ("absPath" in project) {
         this._project = project;
      } else if (
         (project instanceof ProjectCollectionResult ||
            project instanceof InstantProjectResult) &&
         !project.isEmpty()
      ) {
         this._project = project.getFirstResult();
      } else {
         throw new Error(
            "Invalid object provided to constructor of InstantProjectResult"
         );
      }
   }

   get project() {
      return this._project;
   }

   isEmpty() {
      // a single / instant result is never treated empty
      return false;
   }

   isSingleResult() {
      // is a single result, so yes
      return true;
   }

   getFirstResult() {
      return this.project;
   }
}

module.exports = {
   ProjectAddSuccess,
   ProjectUpdateSuccess,
   ProjectCollectionResult,
   InstantProjectResult,
};
