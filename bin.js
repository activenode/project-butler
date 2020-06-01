/**
 * Important:
 * This is an interface layer for an overlaying shell caller.
 * This is because node can only fork/spawn but cannot actually manipulate
 * the open shell.
 */
const { version: VERSION } = require("./package.json");

require("./utils/stdoutToStderrProxy");

const cli = require("commander"),
   ensureStorageExistence = require("./db/ensureStorageExistence"),
   getDatabaseManager = require("./db/getDatabaseManager"),
   // ------------------------------
   cliCmd_addProject = require("./cli/addProject"),
   cliCmd_removeProject = require("./cli/removeProject"),
   cliCmd_openProjectOrCallCommand = require("./cli/openProjectOrCallCommand"),
   // ------------------------------
   cli_flagsOnly_returnShellScript = require("./cli/_flagsOnly_shellScript"),
   cli_flagsOnly_installAliasInShellRc = require("./cli/_flagsOnly_installAliasInShellRc"),
   cli_catchAll = require("./cli/catchAll");

// gotta make sure we can write to the Database! Safety first!
ensureStorageExistence();

// now connect to the Database and get a Manager instance where we can fetch and write
const db = getDatabaseManager();

//----------------------------------------
cli.version(VERSION, "-v, --version", "output the current version")
   .option("-s, --shell-script", "Return the shell script")
   .option("-i, --install", "Tries to install the shell script");

const commands = [
   cliCmd_addProject,
   cliCmd_removeProject,
   cliCmd_openProjectOrCallCommand,
];

commands.forEach((cmdBinder) => cmdBinder(cli, db));

// parse the cli arguments
const parsedCliArgs = cli.parse(process.argv);

if (!parsedCliArgs.args || parsedCliArgs.args.length == 0) {
   // ! Each of the following functions will only run if the previous one returned Boolean(true)
   // ! This makes them mutual exclusive and the catchAll only runs if the others did not apply

   const mutualExclusiveExecutors = [
      cli_flagsOnly_returnShellScript,
      cli_flagsOnly_installAliasInShellRc,
      cli_catchAll,
   ];

   let lastPromise = Promise.resolve();
   mutualExclusiveExecutors.forEach((cmdToExecuteAfterLastPromiseResolved) => {
      lastPromise = lastPromise.then(
         () =>
            new Promise((next) => {
               cmdToExecuteAfterLastPromiseResolved(
                  cli,
                  db,
                  parsedCliArgs,
                  next
               );
            })
      );
   });
}
