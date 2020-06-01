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
   setupCommand_addProject = require("./cli/addProject"),
   setupCommand_removeProject = require("./cli/removeProject"),
   setupCommand_openProjectOrCallCommand = require("./cli/openProjectOrCallCommand"),
   // ------------------------------
   cli_returnShellScript = require("./cli/commandless/shellScript"),
   cli_installAliasInShellRc = require("./cli/commandless/installAliasInShellRc"),
   cli_catchAll = require("./cli/commandless/catchAll");

// gotta make sure we can write to the Database! Safety first!
ensureStorageExistence();

// now connect to the Database and get a Manager instance where we can fetch and write
const db = getDatabaseManager();

//----------------------------------------
cli.version(VERSION, "-v, --version", "output the current version")
   .option("-s, --shell-script", "Return the shell script")
   .option("-i, --install", "Tries to install the shell script");

setupCommand_addProject(cli, db);
setupCommand_removeProject(cli, db);
setupCommand_openProjectOrCallCommand(cli, db);

// parse the cli arguments
const parsedCliArgs = cli.parse(process.argv);

if (!parsedCliArgs.args || parsedCliArgs.args.length == 0) {
   // ! Each of the following functions will only run if the previous one returned Boolean(true)
   // ! This makes them mutual exclusive and the catchAll only runs if the others did not apply

   const mutualExclusiveCliEvaluators = [
      cli_returnShellScript,
      cli_installAliasInShellRc,
      cli_catchAll,
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
