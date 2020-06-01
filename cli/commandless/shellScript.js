const { StdoutToStderrProxy } = require("../../utils/stdoutToStderrProxy");

module.exports = function (cli, db, flags, next) {
   if (flags.shellScript === true) {
      StdoutToStderrProxy.writeToActualStdout(
         require("../../assets/shellscript.string")
      );
   } else {
      next();
   }
};
