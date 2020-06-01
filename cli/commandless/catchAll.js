const getCWD = process.cwd,
   enquirer = require("enquirer"),
   config = require("../../config");

module.exports = function (cli, db, flags) {
   db.fetchAll().then((projectListResult) => {
      if (!projectListResult || !Array.isArray(projectListResult.resultData)) {
         throw new Error("Invalid Result");
      }

      const projectsArray = projectListResult.resultData;

      const longestDirectoryNameLength = projectsArray.reduce(
         (longestInt, { directoryName }) => {
            return longestInt > directoryName.length
               ? longestInt
               : directoryName.length;
         },
         0
      );

      new enquirer.AutoComplete({
         name: "project",
         message: "Choose a project (type for autocompletion)",
         stdout: process.stderr,
         choices: projectsArray.map(({ absPath, directoryName, aliases }) => {
            const homeDirRx = new RegExp("^" + config.homedir, "i");
            return {
               value: {
                  absPath,
                  directoryName,
                  aliases,
                  toString: function () {
                     return absPath;
                  },
               },
               // name: absPath,
               message: `${directoryName.padEnd(
                  longestDirectoryNameLength,
                  " "
               )} ${absPath.replace(homeDirRx, "~")}`,
            };
         }),
      })
         .run()
         .then(({ aliases, absPath }) => {
            if (!fs.existsSync(absPath)) {
               console.log("--------------------");
               new enquirer.Confirm({
                  message: "ℹ️  The directory is gone! Delete it?  ",
                  stdout: process.stderr,
                  initial: "Y",
               })
                  .run()
                  .then((boolDoDelete) => {
                     if (!boolDoDelete) {
                        console.log(`No worries I left it in the List!`);
                     }
                  })
                  .catch(console.error);
            } else {
               console.log("Switching to the directory now");
               openProjectOrCallAction(aliases[0], path.resolve(getCWD()));
            }
         })
         .catch(console.error);
   });
};
