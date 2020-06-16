const path = require("path"),
   getCWD = process.cwd,
   fs = require("fs"),
   colors = require("colors/safe"),
   { log, logErr } = require("../utils/log"),
   {
      ProjectAddSuccess,
      ProjectUpdateSuccess,
   } = require("../db/dbResultModels");

const logAliases = (projectDirectory, aliases) => {
   log(
      `Aliases for ${colors.bold.inverse(projectDirectory)}: \n${aliases
         .map((aliasString) => {
            return `\n ${colors.bold(`＋ ${aliasString} `)}`;
         })
         .join("")}`
   );
};

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
               `🐼 Sorry Pandabear! The given path to ${absPath} is not a directory`
            );
            return;
         }

         const dirname = path.basename(absPath);

         db.addProject(absPath, aliases)
            .then((dbResult) => {
               log("");
               if (dbResult instanceof ProjectAddSuccess) {
                  log(
                     ` 😌 Successfully added the project [${colors.bold.inverse(
                        dirname
                     )}] `
                  );
                  logAliases(
                     dbResult.projectDetails.absPath,
                     dbResult.projectDetails.aliases
                  );
               } else if (dbResult instanceof ProjectUpdateSuccess) {
                  log(" 👋 Successfully updated the project ");
                  logAliases(
                     dbResult.projectDetails.absPath,
                     dbResult.projectDetails.aliases
                  );
               } else {
                  throw new Error(`Unknown Error occurred`);
               }
            })
            .catch((error) => {
               if (error instanceof Error) {
                  logErr(error.message);
               }
            });
      });
};
