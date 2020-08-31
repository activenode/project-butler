const path = require("path"),
   { logBox } = require("../utils/log"),
   colors = require("colors/safe"),
   getCWD = process.cwd;

module.exports = function (cli, db) {
   cli.command("remove [aliases...]")
      .option(
         "-a, --all",
         "If --all param is set it will completely remove the directory from the list with all its aliases"
      )
      .description(
         "If no alias is provided it will try to delete all aliases from your current directory"
      )
      .action((aliases, cmd) => {
         const absPath = path.resolve(getCWD());

         if (!aliases || aliases.length === 0) {
            db.removeByDirectory(absPath).then((result) => {
               if (result === "NOT_STORED") {
                  logBox(colors.bold("Directory is not in part of your project list"));
               } else {
                  logBox(
                     colors.bold(`🦄 Removed this directory from the project list`)
                  );
               }
            });
         } else {
            db.removeByAliases(aliases, cmd.all).then((_) => {
               console.log(_);
            });
         }
      });
};
