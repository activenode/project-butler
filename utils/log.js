const colors = require("colors/safe");

const LOG_TEXTS = {
   FOUND_MULTIPLE_PLEASE_CHOOSE: "✳️ Found multiple entries, please select one",
   SELECTION_CANCELLED: "You did not select anything",
   UNKOWN_ERROR: "An unknown error occured",
};

function log() {
   console.log.apply(console.log, arguments);
}

function logDivider() {
   log("-");
}

function logErr() {
   console.error.apply(console.error, arguments);
}

function logDirectorySwitchInfo(cdPath) {
   return log(`  ➡️ ${colors.bold(`${cdPath}`)}`);
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

/**
 * Logs the aliases that are already reserved due of them being taken
 * @param {Array<{alias, absPath}>} aliasesTaken
 */
function logAliasesTakenMessage(aliasesTaken /* Array<{alias, absPath}> */) {
   // ✖
   log(
      `The following aliases are already in use \n${aliasesTaken.map(
         (aliasObj) => `  ${colors.bold(aliasObj.alias)} => ${aliasObj.absPath}`
      )}`
   );
}

module.exports.log = log;
module.exports.logDivider = logDivider;
module.exports.logErr = logErr;
\;
module.exports.logProjectAliases = logProjectAliases;
module.exports.logDirectorySwitchInfo = logDirectorySwitchInfo;
module.exports.logAliasesTakenMessage = logAliasesTakenMessage;
module.exports.LOG_TEXTS = LOG_TEXTS;
