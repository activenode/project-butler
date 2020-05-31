const io = require("../io"),
   { sep: separator } = require("path"),
   config = require("../config"),
   hydrateDatabase = require("./database");

module.exports = (function () {
   let _databaseConnection;

   return function () {
      if (!_databaseConnection) {
         const databaseFile = io.open(
            config.database.dbManagerFilePathAbsolute
         );

         _databaseConnection = hydrateDatabase(databaseFile, separator);
      }

      return _databaseConnection;
   };
})();
