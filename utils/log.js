const colors = require("colors/safe");

function log() {
   console.log.apply(console.log, arguments);
}

function logBox() {
   console.log("");
   console.log.apply(console.log, arguments);
   console.log("---");
}

function logErr() {
   console.error.apply(console.error, arguments);
}

function logProjectAliases(projectDirectory, aliases) {
   log(
      `Aliases for ${colors.bold.inverse(projectDirectory)}: \n${aliases
         .map((aliasString) => {
            return `\n ${colors.bold(`＋ ${aliasString} `)}`;
         })
         .join("")}`
   );

   log("");
}

module.exports.log = log;
module.exports.logErr = logErr;
module.exports.logBox = logBox;
module.exports.logProjectAliases = logProjectAliases;
