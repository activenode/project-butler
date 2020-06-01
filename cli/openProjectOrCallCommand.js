const path = require("path"),
   { StdoutToStderrProxy } = require("../utils/stdoutToStderrProxy"),
   shellify = require("../shell/shellify")(StdoutToStderrProxy),
   { CommandWrapper } = require("../db/dbResultModels"),
   parsePackageJson = require("../utils/parsePackageJson"),
   getCWD = process.cwd;

module.exports = function (cli, db) {
   const tryOpenProjectByAliasOrName = (aliasOrName) => {
      db.findBestMatch(aliasOrName).then(shellify);
   };

   const openProjectOrCallAction = (
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
               shellify(new CommandWrapper(`npm run ${projectNameOrAction}`));
            }
         }

         if (!bCommandCalled) {
            // didnt find any fitting command so search for project-fit
            tryOpenProjectByAliasOrName(projectNameOrAction);
         }
      });
   };

   cli.command("cd [alias]")
      .description("Open project")
      .action((alias) => tryOpenProjectByAliasOrName(alias));

   cli.command("*")
      .description("Open project or trigger action")
      .action((projectNameOrAction, cmd) => {
         if (projectNameOrAction) {
            openProjectOrCallAction(
               projectNameOrAction,
               path.resolve(getCWD())
            );
         }
      });
};
