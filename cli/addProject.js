const path = require("path"),
   getCWD = process.cwd,
   fs = require("fs"),
   colors = require("colors/safe"),
   {
      LOG_TEXTS,
      log,
      logErr,
      logProjectAliases,
      logBox,
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

         db.addProject(absPath, aliases)
            .then((dbResult) => {
               log("");
               if (dbResult instanceof ProjectAddSuccess) {
                  logBox(
                     ` 😌  Successfully added the project [${colors.bold.inverse(
                        dirname
                     )}] `
                  );
                  logProjectAliases(
                     dbResult.projectDetails.absPath,
                     dbResult.projectDetails.aliases
                  );
               } else if (dbResult instanceof ProjectUpdateSuccess) {
                  log(" 👋  Successfully updated the project \n");
                  logProjectAliases(
                     dbResult.projectDetails.absPath,
                     dbResult.projectDetails.aliases
                  );
               } else if (dbResult instanceof AliasesAlreadyTakenError) {
                  log(
                     `You wanted to map ${absPath} with ${dbResult.project.aliases}`
                  );
                  logAliasesTakenMessage(dbResult.aliasesTaken);
               } else {
                  throw new Error(LOG_TEXTS.UNKOWN_ERROR);
               }
            })
            .catch((error) => {
               if (error instanceof Error) {
                  logErr(error);
               } else {
                  logErr(
                     `${LOG_TEXTS.UNKNOWN_ERROR} - whilst adding a project`
                  );
               }
            });
      });
};
