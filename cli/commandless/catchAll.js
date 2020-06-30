const { OutputController } = require("../../utils/OutputController"),
   { AutoCompleteProjects, Confirm } = require("../../utils/prompt"),
   { log, logErr } = require("../../utils/log"),
   fs = require("fs"),
   { ProjectCollectionResult } = require("../../db/dbResultModels");

module.exports = function (cli, db, flags) {
   db.fetchAll().then((dbResult) => {
      if (!dbResult || !(dbResult instanceof ProjectCollectionResult)) {
         throw new Error("Invalid Result type");
      }

      AutoCompleteProjects(dbResult.projects)
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
