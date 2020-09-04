const path = require("path"),
   { OutputController } = require("../utils/OutputController"),
   colors = require("colors/safe"),
   {
      ProjectCollectionResult,
      InstantProjectResult,
   } = require("../db/dbResultModels"),
   { AutoCompleteProjects } = require("../utils/prompt"),
   { logBox, logErr, logDirectorySwitchInfo } = require("../utils/log"),
   listAll = require("./commandless/listAll"),
   parsePackageJson = require("../utils/parsePackageJson"),
   getCWD = process.cwd;

function matchAndOpenProject(db, projectNameOrAction) {
   return db.findBestMatch(projectNameOrAction).then((result) => {
      const isProjectResult = result instanceof ProjectCollectionResult;
      const isInstantResult = result instanceof InstantProjectResult;

      if (isInstantResult) {
         const absPath = result.project.absPath;
         logDirectorySwitchInfo(absPath);
         OutputController.shell().cd(result.project.absPath);
      } else if (isProjectResult && !result.isEmpty()) {
         AutoCompleteProjects(result.projects);
      } else if (isProjectResult) {
         logBox(
            `✖ Tried to find a project matching '${colors.bold(
               projectNameOrAction
            )}' but could not find any 🐱.`
         );

         listAll(null, db, null);
      } else {
         logErr(
            "Did not find a project because errorneous result was retrieved from database ( should not happen :} )"
         );
      }
   });
}

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
   return db
      .getExactProjectResultByAbsoluteDirectory(currentWorkingDirectoryAbsPath)
      .then((projectResult) => {
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
               OutputController.shell().command(
                  `npm run ${projectNameOrAction}`
               );

               return false; // just to end this even earlier
            }
         }

         if (!bCommandCalled) {
            return matchAndOpenProject(projectNameOrAction);
         }
      });
};

module.exports = function (cli, db) {
   cli.command("cd [alias]")
      .description("Open project")
      .action((alias) => {
         matchAndOpenProject(db, alias);
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
         } else {
            throw new Error(
               "This error should not trigger since the catch-all command should never deliver an empty result. Please report this error if it occurs anyway."
            );
         }
      });
};
