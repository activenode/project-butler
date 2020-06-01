const path = require("path"),
   { StdoutToStderrProxy } = require("../utils/stdoutToStderrProxy"),
   shellify = require("../shell/shellify")(StdoutToStderrProxy),
   getCWD = process.cwd;

module.exports = function (cli, db) {
   cli.command("add [aliases...]")
      .option("-d, --dir [path]", "Directory to add. Default: CWD")
      .description("Adds current directory.")
      .action((aliases, cmd) => {
         const absPath = path.resolve(cmd.dir || getCWD());
         db.addProject(absPath, aliases).then(shellify);
      });
};
