const homedir = require("./utils/getHomeDirectory");

const directoryNameProjectButler = ".project-butler";
const dbRootDirectory = `${homedir}/${directoryNameProjectButler}`;

const shellAliasGetterString = "project-butler -s";
const shellAliasGetterEvalString = 'eval "$(project-butler -s)"';

module.exports = {
   homedir,
   database: {
      dbRootDirectory,
      dbManagerFilePathAbsolute: `${dbRootDirectory}/storage`,
   },
   shellCommands: {
      shellAliasGetterString,
      shellAliasGetterEvalString,
   },
};
