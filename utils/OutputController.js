const OUTPUT_MODES = {
   NORMAL: "NORMAL",
   STDOUT_TO_STDERR: "STDOUT_TO_STDERR",
};

class OutputController {
   static init() {
      OutputController.currentMode = OUTPUT_MODES.NORMAL;
      OutputController.old_stdout_write = process.stdout.write;
   }

   static stdoutToStderr() {
      process.stdout.write = function () {
         process.stderr.write.apply(process.stderr, arguments);
      };
   }

   static stdoutToStderrUntilResolved(promiseToResolve) {
      if (!(promiseToResolve instanceof Promise)) {
         throw new Error("I need a promise my dear!");
      }

      OutputController.stdoutToStderr();
      return promiseToResolve.then(function () {
         OutputController.resetToDefault();
         return arguments;
      });
   }

   static writeToActualStdout() {
      OutputController.old_stdout_write.apply(process.stdout, arguments);
   }

   static resetToDefault() {
      process.stdout.write = OutputController.old_stdout_write;
   }

   static onExit(exitCode) {
      // only for debugging reasons
      // console.log('exit was called with code=', exitCode);
   }

   static shell() {
      const shellEvalDetectionComment = '#shell \n';
      const c = shellEvalDetectionComment;

      return {
         cd: function (cdPath) {
            OutputController.writeToActualStdout(`${c}cd ${cdPath}`);
         },
         command: function (rawCommand) {
            OutputController.writeToActualStdout(`${c}${rawCommand}`);
         },
      };
   }
}

process.on("exit", (exitCode) => {
   OutputController.onExit(exitCode);
});

OutputController.init();
OutputController.stdoutToStderr();

module.exports.OutputController = OutputController;
