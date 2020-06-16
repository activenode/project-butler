const colors = require("colors/safe"),
   fs = require("fs"),
   { log, logErr } = require("../../utils/log");

module.exports = function (cli, db, flags, next) {
   if (flags.clean === true || flags.cleanup === true) {
      db.fetchAll()
         .then((dbResult) => {
            if (!dbResult || !Array.isArray(dbResult.projects)) {
               throw new Error(
                  "Cannot execute cleanup since no existing projects could be retrieved. Unknown error!"
               );
            } else {
               const toRemove = dbResult.projects.reduce(
                  (_list, { absPath }) => {
                     const doesStillExist = fs.existsSync(absPath);

                     if (!doesStillExist) {
                        return [..._list, absPath];
                     } else {
                        return _list;
                     }
                  },
                  []
               );

               if (toRemove.length === 0) {
                  log("Nothing found to clean up 🦄");
                  return;
               }

               Promise.all(
                  toRemove.map((absPath) => db.removeByDirectory(absPath))
               )
                  .then(() =>
                     log(
                        `Cleaned up ${toRemove.length} project${
                           toRemove.length !== 1 ? "s" : ""
                        } 🔥`
                     )
                  )
                  .catch(logErr);
            }
         })
         .catch(logErr);
   } else {
      next();
   }
};
