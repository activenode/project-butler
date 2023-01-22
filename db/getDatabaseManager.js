const io = require("../io"),
   config = require("../config"),
   ProjectDatabase = require("./database");

module.exports = (function () {
   let _databaseConnection;

   return function () {
      if (!_databaseConnection) {
         const databaseFile = io.open(
            config.database.dbManagerFilePathAbsolute
         );

         _databaseConnection = new ProjectDatabase(databaseFile);
      }

      return _databaseConnection;
   };
})();
