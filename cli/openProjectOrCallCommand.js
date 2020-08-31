const { log } = require("util");

const path = require("path"),
   { OutputController } = require("../utils/OutputController"),
   colors = require("colors/safe"),
   { ProjectCollectionResult } = require("../db/dbResultModels"),
   { AutoCompleteProjects } = require("../utils/prompt"),
   parsePackageJson = require("../utils/parsePackageJson"),
   getCWD = process.cwd;

const openProjectOrCallAction = (
   db,
   projectNameOrAction,
   currentWorkingDirectoryAbsPath
) => {
   // check if we currently are in a working directory that
   // is in our database (so its a project-butler project)
   // if yes first check if there is npm commands to run
   // we might consider at a later point to genericify the tool (npm, yarn, whatever)
   // but for now npm should be okay

   db.getExactProjectResultByAbsoluteDirectory(
      currentWorkingDirectoryAbsPath
   ).then((projectResult) => {
      let bCommandCalled = false;
      if (projectResult) {
         // got a hit. is already in a project-butler directory right now
         // lets check if there is a package json with scripts
         const packageJson = parsePackageJson(
            `${currentWorkingDirectoryAbsPath}/package.json`
         );
         const potentialNpmScriptToExecute = packageJson._getScript(
            projectNameOrAction
         );

         if (potentialNpmScriptToExecute) {
            bCommandCalled = true;
            OutputController.shell().command(`npm run ${projectNameOrAction}`);
         }
      }

      if (!bCommandCalled) {
         db.findBestMatch(projectNameOrAction).then((result) => {
            const isProjectResult = result instanceof ProjectCollectionResult;
            if (isProjectResult && !result.isEmpty()) {
               AutoCompleteProjects(result.projects);
            } else if (isProjectResult) {
               console.log(
                  `Tried to find a project matching '${colors.bold(
                     projectNameOrAction
                  )}' but could not find any 🐱`
               );
            } else {
               console.error(
                  "Did not find a project because errorneous result was retrieved from database"
               );
            }
         });
      }
   });
};

module.exports = function (cli, db) {
   cli.command("cd [alias]")
      .description("Open project")
      .action((alias) => {
         console.log("do db.findBestMatch(aliasOrName).");
      });

   cli.command("*")
      .description("Open project or trigger action")
      .action((projectNameOrAction, cmd) => {
         if (projectNameOrAction) {
            openProjectOrCallAction(
               db,
               projectNameOrAction,
               path.resolve(getCWD())
            );
         }
      });
};

module.exports.openProjectOrCallAction = openProjectOrCallAction;
