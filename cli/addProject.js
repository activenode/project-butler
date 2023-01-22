const path = require("path"),
   getCWD = process.cwd,
   fs = require("fs"),
   colors = require("colors/safe"),
   {
      LOG_TEXTS,
      log,
      logErr,
      logProjectAliases,
      logAliasesTakenMessage,
   } = require("../utils/log"),
   {
      ProjectAddSuccess,
      ProjectUpdateSuccess,
      AliasesAlreadyTakenError,
   } = require("../db/dbResultModels");

module.exports = function (cli, db) {
   cli.command("add [aliases...]")
      .option("-d, --dir [path]", "Directory to add. Default: CWD")
      .description("Adds current directory.")
      .action((aliases, cmd) => {
         const absPath = path.resolve(cmd.dir || getCWD());

         try {
            const isDirectory = fs.statSync(absPath).isDirectory();

            if (!isDirectory) {
               throw new Error("Is not a directory");
            }
         } catch (e) {
            logErr(
               `\n${colors.red(`✖`)} The given path to ${colors.bold(
                  absPath
               )} is not a directory 🐼`
            );
            return;
         }

         const dirname = path.basename(absPath);

         const dbResult = db.addProject(absPath, aliases);

         try {
            log("");
            if (dbResult instanceof ProjectAddSuccess) {
               log(
                  `😌  Successfully added the project ${colors.bold(dirname)} `
               );
               log("");
               logProjectAliases(dbResult.projectDetails.path, [
                  ...dbResult.projectDetails.getAliases(),
               ]);
            } else if (dbResult instanceof ProjectUpdateSuccess) {
               log(" 👋  Successfully updated the project \n");
               logProjectAliases(dbResult.projectDetails.path, [
                  ...dbResult.projectDetails.getAliases(),
               ]);
            } else if (dbResult instanceof AliasesAlreadyTakenError) {
               log(
                  `You wanted to map ${absPath} with ${dbResult.project.getAliases()}`
               );
               logAliasesTakenMessage(dbResult.aliasesTaken);
            } else {
               logErr(`${LOG_TEXTS.UNKNOWN_ERROR} - whilst adding a project`);
            }
         } catch (error) {
            logErr(error);
         }
      });
};
