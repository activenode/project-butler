const { OutputController } = require("../../utils/OutputController"),
   { AutoComplete, Confirm } = require("../../utils/prompt"),
   { log, logErr } = require("../../utils/log"),
   fs = require("fs"),
   config = require("../../config"),
   { ProjectCollectionResult } = require("../../db/dbResultModels");

module.exports = function (cli, db, flags) {
   db.fetchAll().then((dbResult) => {
      if (!dbResult || !(dbResult instanceof ProjectCollectionResult)) {
         throw new Error("Invalid Result type");
      }

      const projectsArray = dbResult.projects;

      const longestDirectoryNameLength = projectsArray.reduce(
         (longestInt, { directoryName }) => {
            return longestInt > directoryName.length
               ? longestInt
               : directoryName.length;
         },
         0
      );

      AutoComplete({
         name: "project",
         message: "Choose a project (type for autocompletion)",
         choices: projectsArray.map(({ absPath, directoryName, aliases }) => {
            const homeDirRx = new RegExp("^" + config.homedir, "i");
            return {
               value: {
                  absPath,
                  directoryName,
                  aliases,
                  toString: function () {
                     return absPath; // we need the toString method since enquirer will call value.toString()
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
         .then(({ absPath }) => {
            if (!fs.existsSync(absPath)) {
               log("--------------------");
               Confirm({
                  message:
                     "ℹ️  The directory is gone! Remove from butler list?  ",
               })
                  .then((bool) => {
                     if (!bool) {
                        log(`No worries I left it in the List!`);
                     } else {
                        db.removeByDirectory(absPath)
                           .then(() => log("Done!"))
                           .catch((e) =>
                              logErr(
                                 "Could not remove project from list. Unknown error occured.",
                                 e
                              )
                           );
                     }
                  })
                  .catch(logErr);
            } else {
               log("Switching to the directory now");

               const normalizedPath = absPath.replace(" ", "\\ ");
               OutputController.shell().cd(normalizedPath);
            }
         })
         .catch(logErr);
   });
};
