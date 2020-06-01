const path = require("path"),
   { StdoutToStderrProxy } = require("../utils/stdoutToStderrProxy"),
   shellify = require("../shell/shellify")(StdoutToStderrProxy),
   getCWD = process.cwd,
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
                  console.log(" 👋 Successfully updated the project ");
               } else {
                  throw new Error(`Unknown Error occurred ${dbResult}`);
               }
            })
            .catch((error) => {
               console.error(error);
            });
      });
};
