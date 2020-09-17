const colors = require("colors/safe"),
   config = require("../../config"),
   enquirer = require("enquirer"),
   fs = require("fs"),
   { shellRcPaths } = require("../../utils/shell.meta");

function onShellInstallationFail(e) {
   console.log(
      colors.bold.inverse(
         "Could not access your config file. Please add the line manually to your shell config:"
      )
   );
   console.log("");
   console.log(colors.bold(config.shellCommands.shellAliasGetterEvalString));
   console.log(e ? e : "");
}

// setup an autocomplete to be used later 🤓
const shellRcSelectAutocomplete = new enquirer.AutoComplete({
   name: "shellPath",
   message: "What is the path to your shell config?",
   stdout: process.stderr,
   choices: shellRcPaths.map((shellPath) => {
      return {
         title: shellPath,
         value: {
            shellPath,
            toString: () => shellPath,
         },
      };
   }),
});

module.exports = function (cli, db, flags, next) {
   if (flags.install === true) {
      // Trigger the installation process of the shell command
      shellRcSelectAutocomplete
         .run()
         .then(({ shellPath }) => {
            const rcFileExists = fs.existsSync(shellPath);
            let bWrite = false;

            try {
               if (rcFileExists) {
                  const rcFileContents = fs.readFileSync(shellPath);

                  if (!rcFileContents) {
                     throw new Error("Could not read the file contents");
                  } else if (
                     rcFileContents.includes(
                        config.shellCommands.shellAliasGetterString
                     )
                  ) {
                     console.log(
                        colors.bold.inverse(
                           " Seems to be installed already ✅ "
                        )
                     );
                  } else {
                     bWrite = true;
                  }
               } else {
                  bWrite = true;
               }

               if (bWrite) {
                  fs.appendFileSync(
                     shellPath,
                     `\n\n#project-butler:\n${config.shellCommands.shellAliasGetterEvalString}\n`
                  );
                  console.log(
                     colors.bold.inverse("Well done. You are ready! ✅")
                  );
               }
            } catch (e) {
               throw e;
            }
         })
         .catch((e) => {
            onShellInstallationFail(e);
         });
   } else {
      next();
   }
};
