const path = require("path"),
   getCWD = process.cwd,
   columns = require("cli-columns"),
   colors = require("colors/safe"),
   { StdoutToStderrProxy } = require("../utils/stdoutToStderrProxy"),
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
               if (dbResult instanceof ProjectAddSuccess) {
                  console.log(" 😌 Successfully added the project directory ");
               } else if (dbResult instanceof ProjectUpdateSuccess) {
                  console.log("");
                  console.log(" 👋 Successfully updated the project ");
                  console.log(
                     `Aliases for ${colors.bold.inverse(
                        dbResult.projectDetails.absPath
                     )}: \n${columns(
                        dbResult.projectDetails.aliases.map((aliasString) => {
                           return `\n ${colors.inverse(`*️⃣  ${aliasString} `)}`;
                        })
                     )}`
                  );
               } else {
                  throw new Error(`Unknown Error occurred ${dbResult}`);
               }
            })
            .catch((error) => {
               console.error(error);
            });
      });
};
