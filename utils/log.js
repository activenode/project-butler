const colors = require("colors/safe");

const LOG_TEXTS = {
   FOUND_MULTIPLE_PLEASE_CHOOSE: "✳️ Found multiple entries, please select one",
   SELECTION_CANCELLED: "You did not select anything",
   UNKOWN_ERROR: "An unknown error occured",
   ALIASES_NOT_FOUND_ERROR: "None of the given aliases were found",
   NO_SELECTION_MADE: "No selection was made",
   NO_PROJECTS_FOUND: "Could not find any projects",
};

function log() {
   console.log.apply(console.log, arguments);
}

function logErr() {
   const args = Array.from(arguments);
   const output = colors.bgBlack.red.inverse(` ${args.join("")} `);
   console.error.call(console.error, output);
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

function logProjectCollection(projectCollection) {
   if (
      !projectCollection ||
      !projectCollection.projects ||
      !projectCollection.projects.length
   ) {
      log(LOG_TEXTS.NO_PROJECTS_FOUND);
      return;
   }
   projectCollection.projects.forEach((project) => {
      logProjectAliases(project.absPath, project.aliases);
   });
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
module.exports.logErr = logErr;
module.exports.logProjectAliases = logProjectAliases;
module.exports.logDirectorySwitchInfo = logDirectorySwitchInfo;
module.exports.logAliasesTakenMessage = logAliasesTakenMessage;
module.exports.logProjectCollection = logProjectCollection;
module.exports.LOG_TEXTS = LOG_TEXTS;
