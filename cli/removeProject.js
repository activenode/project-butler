const path = require("path"),
   { log, logErr, logProjectCollection, LOG_TEXTS } = require("../utils/log"),
   colors = require("colors/safe"),
   isEmpty = require("../utils/isEmpty"),
   {
      AliasesNotFoundError,
      ProjectCollectionResult,
   } = require("../db/dbResultModels"),
   getCWD = process.cwd;

module.exports = function (cli, db) {
   cli.command("remove [aliases...]")
      .option(
         "-a, --all",
         "If --all param is set it will completely remove the directory from the list with all its aliases"
      )
      .description(
         "Remove an alias from a project. If no alias is provided it will try to delete all aliases from your current directory and therefore remove the project from the list"
      )
      .action((aliases, cmd) => {
         const absPath = path.resolve(getCWD());

         if (isEmpty(aliases)) {
            db.removeByDirectory(absPath).then((result) => {
               if (result === "NOT_STORED") {
                  log(
                     `${colors.red(
                        `✖`
                     )} Directory is not part of your project list so I cannot remove it:\n  ${absPath}`
                  );
               } else {
                  log(
                     colors.bold(
                        `🦄  Removed this directory from the project list`
                     )
                  );
               }
            });
         } else {
            db.removeByAliases(aliases, cmd.all).then((_) => {
               if (_ instanceof AliasesNotFoundError) {
                  logErr(LOG_TEXTS.ALIASES_NOT_FOUND_ERROR);
               } else if (_ instanceof ProjectCollectionResult) {
                  log("✅ Remaining projects:");
                  log("");
                  logProjectCollection(_);
               } else {
                  logErr(LOG_TEXTS.UNKNOWN_ERROR);
               }
            });
         }
      });
};
