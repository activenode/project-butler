const { log, logErr, logProjectCollection } = require("../utils/log");

module.exports = function (cli, db) {
   cli.command("list-all")
      .description("Shows all mappings of existing projects")
      .action(() => {
         db.fetchAll()
            .then((_) => {
               log("");
               log("✅ Existing projects:");
               log("");
               logProjectCollection(_);
            })
            .catch(logErr);
      });
};
