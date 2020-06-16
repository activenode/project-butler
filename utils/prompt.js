const enquirer = require("enquirer");

module.exports.AutoComplete = function ({ name, message, choices, stdout }) {
   return new enquirer.AutoComplete({
      name: name,
      message: message,
      stdout: stdout ? stdout : process.stderr,
      choices: choices,
   }).run();
};

module.exports.Confirm = function ({ message, initial }) {
   return new enquirer.Confirm({
      message: message,
      stdout: process.stderr,
      initial: initial ? initial : "Y",
   }).run();
};
