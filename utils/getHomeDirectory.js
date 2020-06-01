const osHomedir = require("os-homedir");

const homedir = osHomedir();
if (!homedir) {
   console.error("ERROR: Home Directory could not be resolved");
   process.exit(1);
}

module.exports = homedir;
