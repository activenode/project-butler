const path = require("path"),
   getCWD = process.cwd,
   colors = require("colors/safe"),
   {
      ProjectAddSuccess,
      ProjectUpdateSuccess,
   } = require("../db/dbResultModels");

module.exports = function (cli, db) {
   cli.command("add [aliases...]")
      .option("-d, --dir [path]", "Directory to add. Default: CWD")
      .description("Adds current directory.")
      .action((aliases, cmd) => {
         const absPath = path.resolve(cmd.dir || getCWD());
         // db.addProject(absPath, aliases).then(shellify);

         db.addProject(absPath, aliases)
            .then((dbResult) => {
               console.log("");
               if (dbResult instanceof ProjectAddSuccess) {
                  console.log(" 😌 Successfully added the project directory ");
               } else if (dbResult instanceof ProjectUpdateSuccess) {
                  console.log(" 👋 Successfully updated the project ");
                  console.log(
                     `Aliases for ${colors.bold.inverse(
                        dbResult.projectDetails.absPath
                     )}: \n${dbResult.projectDetails.aliases
                        .map((aliasString) => {
                           return `\n ${colors.bold(`＋ ${aliasString} `)}`;
                        })
                        .join("")}`
                  );
               } else {
                  throw new Error(`Unknown Error occurred`);
               }
            })
            .catch((error) => {
               if (error instanceof Error) {
                  console.error(error.message);
               }
            });
      });
};
