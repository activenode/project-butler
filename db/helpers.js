const fs = require("fs"),
   {
      homedir,
      database: { dbRootDirectory, dbManagerFilePathAbsolute },
   } = require("../config");

function syncEnsureStorageExists() {
   // to be honest i forgot where the name
   // "alclipm" comes from. Probably some abbreviation that i forgot.
   // maybe in the future migrate to just `.project-butler`

   function ensureFSExistence(
      fsPath,
      syncOnNotExistFunc = (path) => {
         fs.mkdirSync(path);
      },
      bSecondTry = false
   ) {
      if (fs.existsSync(fsPath)) return;
      if (bSecondTry) throw new Error(`EACCESS could not create  ${fsPath}`);

      try {
         syncOnNotExistFunc(fsPath), ensureFSExistence(fsPath, null, true);
      } catch (e) {
         if (e.syscall && e.syscall == "mkdir") {
            console.error(
               `${fsPath} could not be created. Make sure that ${homedir} exists and is writeable`
            );
         } else {
            console.error(e);
         }
         process.exit(1);
      }
   }

   ensureFSExistence(dbRootDirectory);
   ensureFSExistence(dbManagerFilePathAbsolute, (path) => {
      fs.closeSync(fs.openSync(path, "w"));
   });
}

module.exports.syncEnsureStorageExists = syncEnsureStorageExists;
