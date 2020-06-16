const { OutputController } = require("../../utils/OutputController");

module.exports = function (cli, db, flags, next) {
   if (flags.shellScript === true) {
      OutputController.writeToActualStdout(
         require("../../assets/shellscript.string")
      );
   } else {
      next();
   }
};
