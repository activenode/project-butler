const OUTPUT_MODES = {
   NORMAL: "NORMAL",
   STDOUT_TO_STDERR: "STDOUT_TO_STDERR",
};

class StdoutToStderrProxy {
   static currentMode = OUTPUT_MODES.NORMAL;
   static old_stdout_write = process.stdout.write;

   static stdoutToStderr() {
      process.stdout.write = function () {
         process.stderr.write.apply(process.stderr, arguments);
      };
   }

   static stdoutToStderrUntilResolved(promiseToResolve) {
      if (!(promiseToResolve instanceof Promise)) {
         throw new Error("I need a promise my dear!");
      }

      StdoutToStderrProxy.stdoutToStderr();
      return promiseToResolve.then(function () {
         StdoutToStderrProxy.resetToDefault();
         return arguments;
      });
   }

   static writeToActualStdout() {
      StdoutToStderrProxy.old_stdout_write.apply(process.stdout, arguments);
   }

   static resetToDefault() {
      process.stdout.write = StdoutToStderrProxy.old_stdout_write;
   }

   static onExit(exitCode) {
      // console.log('exit was called with code=', exitCode);
   }
}

process.on("exit", (exitCode) => {
   StdoutToStderrProxy.onExit(exitCode);
});

StdoutToStderrProxy.stdoutToStderr();

module.exports.StdoutToStderrProxy = StdoutToStderrProxy;
