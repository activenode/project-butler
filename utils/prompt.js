const enquirer = require("enquirer"),
   config = require("../config");

function AutoComplete({ name, message, choices, stdout, run = true }) {
   const autoComplete = new enquirer.AutoComplete({
      name: name,
      message: message,
      stdout: stdout ? stdout : process.stderr,
      choices: choices,
   });

   if (run) {
      return autoComplete.run();
   }

   return autoComplete;
}

function Confirm({ message, initial }) {
   return new enquirer.Confirm({
      message: message,
      stdout: process.stderr,
      initial: initial ? initial : "Y",
   }).run();
}

module.exports.AutoCompleteProjects = function (projectsArray = [], opts = {}) {
   const longestDirectoryNameLength = projectsArray.reduce(
      (longestInt, { directoryName }) => {
         return longestInt > directoryName.length
            ? longestInt
            : directoryName.length;
      },
      0
   );

   return AutoComplete({
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
            message: `=> ${aliases[0].padEnd(
               longestDirectoryNameLength,
               " "
            )}  ${absPath.replace(homeDirRx, "~")}`,
         };
      }),
      ...opts,
   });
};

module.exports.AutoComplete = AutoComplete;
module.exports.Confirm = Confirm;
