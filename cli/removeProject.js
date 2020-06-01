const path = require("path"),
   { StdoutToStderrProxy } = require("../utils/stdoutToStderrProxy"),
   shellify = require("../shell/shellify")(StdoutToStderrProxy),
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
            db.removeByDirectory(absPath).then(shellify);
         } else {
            db.removeByAliases(aliases, cmd.all).then(shellify);
         }
      });
};
