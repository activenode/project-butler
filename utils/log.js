const colors = require("colors/safe");

function log() {
   console.log.apply(console.log, arguments);
}

function logDivider() {
   log("-");
}

function logBox() {
   console.log(" ");
   console.log.apply(console.log, arguments);
   console.log(" ");
}

function logErr() {
   console.error.apply(console.error, arguments);
}

function logDirectorySwitchInfo(cdPath) {
   return log(`➡️ Switching to ${colors.inverse(`${cdPath}`)}`);
}

function logProjectAliases(projectDirectory, aliases) {
   log(
      `Aliases for ${colors.bold.inverse(projectDirectory)}: ${aliases
         .map((aliasString) => {
            return `\n ${colors.bold(`＋ ${aliasString} `)}`;
         })
         .join("")}`
   );

   log("");
}

module.exports.log = log;
module.exports.logDivider = logDivider;
module.exports.logErr = logErr;
module.exports.logBox = logBox;
module.exports.logProjectAliases = logProjectAliases;
module.exports.logDirectorySwitchInfo = logDirectorySwitchInfo;
