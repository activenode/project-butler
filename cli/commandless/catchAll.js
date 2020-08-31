const { OutputController } = require("../../utils/OutputController"),
   { AutoCompleteProjects, Confirm } = require("../../utils/prompt"),
   { log, logErr, logDivider, logBox } = require("../../utils/log"),
   colors = require("colors/safe"),
   fs = require("fs"),
   { ProjectCollectionResult } = require("../../db/dbResultModels");

module.exports = function (cli, db, flags) {
   db.fetchAll().then((dbResult) => {
      if (!dbResult || !(dbResult instanceof ProjectCollectionResult)) {
         throw new Error("Invalid Result type");
      }

      if (dbResult.projects.length === 0) {
         logBox(`Howdy 👻. ${colors.bold('I could not find existing projects')}. Try '--help' to see how to add one.`);
         return;
      }

      logDivider();

      AutoCompleteProjects(dbResult.projects)
         .then(({ absPath }) => {
            logDivider();
            if (!fs.existsSync(absPath)) {
               Confirm({
                  message:
                     "ℹ️  The directory is is not on your system anymore! Remove from butler list?  ",
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
               logDivider();
            }
         })
         .catch(logErr);
   });
};
