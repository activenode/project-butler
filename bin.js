const cli = require("commander"),
   { StdoutToStderrProxy } = require("./helpers/stdoutToStderrProxy"),
   colors = require("colors/safe"),
   fs = require("fs"),
   path = require("path"),
   { syncEnsureStorageExists } = require("./db/helpers"),
   getDatabaseManager = require("./db/getDatabaseManager"),
   shellify = require("./shell/shellify")(StdoutToStderrProxy),
   { CommandWrapper } = require("./db/structs"),
   getCWD = process.cwd,
   parsePackageJson = require("./helpers/parsePackageJson"),
   { shellRcPaths } = require("./helpers/shell.meta"),
   { version: VERSION } = require("./package.json"),
   enquirer = require("enquirer"),
   config = require("./config");

/**
 * Important:
 * This is an interface layer for an overlaying shell caller.
 * This is because node can only fork/spawn but cannot actually manipulate
 * the open shell.
 */
syncEnsureStorageExists();
const db = getDatabaseManager();

//----------------------------------------

cli.version(VERSION, "-v, --version", "output the current version");

cli.command("add [aliases...]")
   .option("-d, --dir [path]", "Directory to add. Default: CWD")
   .description("Adds current directory.")
   .action((aliases, cmd) => {
      const absPath = path.resolve(cmd.dir || getCWD());
      db.addProject(absPath, aliases).then(shellify);
   });

cli.command("remove [aliases...]")
   .option(
      "-a, --all",
      "If --all param is set it will completely remove the directory from the list with all its aliases"
   )
   .description(
      "If no alias is provided it will try to delete all aliases from your current directory"
   )
   .action((aliases, cmd) => {
      const absPath = path.resolve(getCWD());

      if (!aliases || aliases.length === 0) {
         db.removeByDirectory(absPath).then(shellify);
      } else {
         db.removeByAliases(aliases, cmd.all).then(shellify);
      }
   });

const tryOpenProjectByAliasOrName = (aliasOrName) => {
   db.findBestMatch(aliasOrName).then(shellify);
};

const openProjectOrCallAction = (
   projectNameOrAction,
   currentWorkingDirectoryAbsPath
) => {
   // check if we currently are in a working directory that
   // is in our database (so its a project-butler project)
   // if yes first check if there is npm commands to run
   // we might consider at a later point to genericify the tool (npm, yarn, whatever)
   // but for now npm should be okay

   db.getExactProjectResultByAbsoluteDirectory(
      currentWorkingDirectoryAbsPath
   ).then((projectResult) => {
      let bCommandCalled = false;
      if (projectResult) {
         // got a hit. is already in a project-butler directory right now
         // lets check if there is a package json with scripts
         const packageJson = parsePackageJson(
            `${currentWorkingDirectoryAbsPath}/package.json`
         );
         const potentialNpmScriptToExecute = packageJson.getScript(
            projectNameOrAction
         );

         if (potentialNpmScriptToExecute) {
            bCommandCalled = true;
            shellify(new CommandWrapper(`npm run ${projectNameOrAction}`));
         }
      }

      if (!bCommandCalled) {
         // didnt find any fitting command so search for project-fit
         tryOpenProjectByAliasOrName(projectNameOrAction);
      }
   });
};

cli.command("cd [alias]")
   .description("Open project")
   .action((alias) => tryOpenProjectByAliasOrName(alias));

cli.command("*")
   .description("Open project or trigger action")
   .action((projectNameOrAction, cmd) => {
      if (projectNameOrAction) {
         prompts([
            {
               type: "select",
               name: "shellPath",
               message: "What is the path to your shell config?",
               choices: shellRcPaths.map((shellPath) => {
                  return { title: shellPath, value: shellPath };
               }),
               initial: 0,
            },
         ]).then(({ shellPath }) => {
            console.log("hi");
         });

         return;
         openProjectOrCallAction(projectNameOrAction, path.resolve(getCWD()));
      }
   });

cli.option("-s, --shell-script", "Return the shell script").option(
   "-i, --install",
   "Tries to install the shell script"
);

const parsed = cli.parse(process.argv);
if (!parsed.args || parsed.args.length == 0) {
   if (parsed.install === true) {
      // Trigger the installation process of the shell command
      prompts([
         {
            type: "select",
            name: "shellPath",
            message: "What is the path to your shell config?",
            choices: shellRcPaths.map((shellPath) => {
               return { title: shellPath, value: shellPath };
            }),
            initial: 0,
         },
      ]).then(({ shellPath }) => {
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
                     colors.bold.inverse("Seems to be installed already ✅")
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
               console.log(colors.bold.inverse("Well done. You are ready! ✅"));
            }
         } catch (e) {
            console.log(
               colors.bold.inverse(
                  "Could not access your files. Please add the line manually to your shell config:"
               )
            );
            console.log("");
            console.log(
               colors.bold(config.shellCommands.shellAliasGetterEvalString)
            );
            console.log("");
         }
      });
   } else if (parsed.shellScript === true) {
      StdoutToStderrProxy.writeToActualStdout(
         require("./assets/shellscript.string")
      );
   } else {
      // just list all!
      db.fetchAll().then((projectListResult) => {
         if (
            !projectListResult ||
            !Array.isArray(projectListResult.resultData)
         ) {
            throw new Error("Invalid Result");
         }

         const projectsArray = projectListResult.resultData;

         const longestDirectoryNameLength = projectsArray.reduce(
            (longestInt, { directoryName }) => {
               return longestInt > directoryName.length
                  ? longestInt
                  : directoryName.length;
            },
            0
         );

         new enquirer.AutoComplete({
            name: "project",
            message: "Choose a project (type for autocompletion)",
            stdout: process.stderr,
            choices: projectsArray.map(
               ({ absPath, directoryName, aliases }) => {
                  const homeDirRx = new RegExp("^" + config.homedir, "i");
                  return {
                     value: {
                        absPath,
                        directoryName,
                        aliases,
                        toString: function () {
                           return absPath;
                        },
                     },
                     // name: absPath,
                     message: `${directoryName.padEnd(
                        longestDirectoryNameLength,
                        " "
                     )} ${absPath.replace(homeDirRx, "~")}`,
                  };
               }
            ),
         })
            .run()
            .then(({ aliases, absPath }) => {
               if (!fs.existsSync(absPath)) {
                  console.log("--------------------");
                  new enquirer.Confirm({
                     message: "ℹ️  The directory is gone! Delete it?  ",
                     stdout: process.stderr,
                     initial: "Y",
                  })
                     .run()
                     .then((boolDoDelete) => {
                        if (!boolDoDelete) {
                           console.log(`No worries I left it in the List!`);
                        }
                     })
                     .catch(console.error);
               } else {
                  console.log("Switching to the directory now");
                  openProjectOrCallAction(aliases[0], path.resolve(getCWD()));
               }
            })
            .catch(console.error);
      });
   }
}

//TODO: p update-aliases emb emb1 emb2 --> will overwrite the first match of emb with aliases emb1 and emb2 which means :
// only emb1 and emb2 will be left.
//other option: p -d /some add newaliases
