require("./utils/OutputController");
// ! ^ we require this so that Stdout is redirected immediately after

/**
 * Important:
 * This is an interface layer for an overlaying shell caller.
 * This is because node can only fork/spawn but cannot actually manipulate
 * the open shell.
 */
const { version: VERSION } = require("./package.json");
const colors = require("colors/safe");
const { log } = require("./utils/log");

const cli = require("commander"),
   ensureStorageExistence = require("./db/ensureStorageExistence"),
   getDatabaseManager = require("./db/getDatabaseManager"),
   // ------------------------------
   setupCommand_addProject = require("./cli/addProject"),
   setupCommand_removeProject = require("./cli/removeProject"),
   setupCommand_openProjectOrCallCommand = require("./cli/openProjectOrCallCommand"),
   // ------------------------------
   cli_returnShellScript = require("./cli/commandless/shellScript"),
   cli_installAliasInShellRc = require("./cli/commandless/installAliasInShellRc"),
   cli_cleanup = require("./cli/commandless/cleanup"),
   cli_listAll = require("./cli/commandless/listAll");

// gotta make sure we can write to the Database! Safety first!
ensureStorageExistence();

// now connect to the Database and get a Manager instance where we can fetch and write
const db = getDatabaseManager();

//----------------------------------------
cli.version(VERSION, "-v, --version", "output the current version")
   .name("p")
   .option("-s, --shell-script", "Return the shell script")
   .option("-i, --install", "Tries to install the shell script")
   .option(
      "-c, --clean, --cleanup",
      "Will remove orphaned projects from the list (just call `p --clean`)"
   );

setupCommand_addProject(cli, db);
setupCommand_removeProject(cli, db);

// The following will setup the command 'project-butler *'
// the start will only trigger for at least one character
setupCommand_openProjectOrCallCommand(cli, db);

cli.on("--help", () => {
   log(
      colors.bold(
         `\n  😇 project-butler will never manipulate or delete any files with any command. \n    ${colors.reset(
            "All commands are safe commands."
         )}`
      )
   );
});

// parse the cli arguments
const parsedCliArgs = cli.parse(process.argv);

const potentialCommand = parsedCliArgs.rawArgs[2];
const commandWasExecuted = ["add", "remove", "cd"].includes(potentialCommand);

// console.log(, "llopts", cli.opts());

if (
   !commandWasExecuted &&
   (!parsedCliArgs.args || parsedCliArgs.args.length == 0)
) {
   // ! Each of the following functions will only run if the previous one returned Boolean(true)
   // ! This makes them mutual exclusive and the catchAll only runs if the others did not apply

   const mutualExclusiveCliEvaluators = [
      cli_returnShellScript, // option -s --shell-script
      cli_installAliasInShellRc, // option -i --install-alias
      cli_cleanup, // option -c --clean --cleanup
      cli_listAll, // if nothing was met this will execute
      // its worth noting that 'catchAll' will not catch
   ];

   // * We follow the same approach as "express" by waiting for the previous "next()" function
   // * to be called. So we execute the next promise only if the previous one resolved!
   let lastPromise = Promise.resolve();
   mutualExclusiveCliEvaluators.forEach((cliEvaluator) => {
      lastPromise = lastPromise.then(
         () =>
            new Promise((next) => {
               cliEvaluator(cli, db, parsedCliArgs, next);
            })
      );
   });
}
