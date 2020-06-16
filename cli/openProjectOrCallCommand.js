const path = require("path"),
   { OutputController } = require("../utils/OutputController"),
   shellify = require("../shell/shellify")(OutputController),
   {
      CommandWrapper,
      ProjectCollectionResult,
   } = require("../db/dbResultModels"),
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
         const potentialNpmScriptToExecute = packageJson.getScript(
            projectNameOrAction
         );

         if (potentialNpmScriptToExecute) {
            bCommandCalled = true;
            // TODO: refactor
            shellify(new CommandWrapper(`npm run ${projectNameOrAction}`));
         }
      }

      if (!bCommandCalled) {
         // didnt find any fitting command so search for project-fit
         //db.findBestMatch(aliasOrName).then(shellify);
         //tryOpenProjectByAliasOrName(projectNameOrAction);

         db.findBestMatch(projectNameOrAction).then((result) => {
            const isProjectResult = result instanceof ProjectCollectionResult;
            if (isProjectResult && !result.isEmpty()) {
               console.log("non empty result", result);
            } else if (isProjectResult) {
               console.log("no project found");
            } else {
               console.error(
                  "Did not find a project because errorneous result was retrieved from database"
               );
            }
         });
         console.log("do db.findBestMatch(aliasOrName).");
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
