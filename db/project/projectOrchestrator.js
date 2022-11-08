const { Project } = require("./project");

module.exports.ProjectOrchestrator = class {
   _nextAvailableIndex = 0;
   _projects = [];

   constructor(jsonSource) {
      if (!jsonSource) {
         return;
      }
   }

   addProject(path, ...aliases) {
      const isProjectAlreadyExsiting = [path, ...aliases].find((identifier) =>
         this.getProject(identifier)
      );
      if (isProjectAlreadyExsiting) {
         return;
      }
      const projectToAdd = new Project(
         this._returnAndUpdateNextAvailableIndex(),
         path,
         ...aliases
      );
      this._projects.push(projectToAdd);
      return projectToAdd;
   }

   removeProject(identifier) {
      const projectToRemove = this.getProject(identifier);
      if (!projectToRemove) {
         return;
      }
      // In case the index is smaller as the current target index, we need to start at the to be removed index
      if (projectToRemove.index < this._nextAvailableIndex) {
         this._nextAvailableIndex = projectToRemove.index;
      }
      const projectIndex = this._projects.indexOf(projectToRemove);
      this._projects.splice(projectIndex, 1);
      return projectToRemove;
   }

   getProject(identifier) {
      return this._projects.find((project) =>
         [...project.aliases, project.path].includes(identifier)
      );
   }

   updateProject(identifier, options) {
      const sourceProject = this.getProject(identifier);
      if (!sourceProject || !options) {
         return;
      }
      const targetPath = options.path || sourceProject.path;
      const targetAliases = options.aliases || sourceProject.aliases;
      const targetProject = new Project(
         sourceProject.index,
         targetPath,
         ...targetAliases
      );
      this._projects.splice(
         this._projects.indexOf(sourceProject),
         1,
         targetProject
      );
      return targetProject;
   }

   _returnAndUpdateNextAvailableIndex() {
      const currentNextAvailableIndex = this._nextAvailableIndex;
      this._updateNextAvailableIndex();
      return currentNextAvailableIndex;
   }

   _updateNextAvailableIndex() {
      do {
         this._nextAvailableIndex++;
      } while (
         this._projects.find(
            (project) => project.index === this._nextAvailableIndex
         )
      );
   }
};
