class ProcessOutputJailer {
    constructor() {
        this.__logSafe = [];
        this.old_stdout_write = process.stdout.write;
        this.old_stderr_write = process.stderr.write;

        process.stdout.write = ((write) => {
            return (string, encoding, fd) => {
                this.__logSafe.push({ type: 'default', loggedString: string });
                //write.apply(process.stdout, arguments)
            }
        })(process.stdout.write);

        process.stderr.write = ((write) => {
            return (string, encoding, fd) => {
                this.__logSafe.push({ type: 'error', loggedString: string });
            }
        })(process.stderr.write);

        process.on('exit', () => {
            this.unhook();
            this.log_flush();
        });
    }

    flush() {
        const logSafe = [].concat(this.__logSafe);
        this.__logSafe = [];
        return logSafe;
    }

    log_flush() {
        this.each_flush(({ type, loggedString }) => {
            if (type === 'error') {
                process.stderr.write.apply(process.stderr, [loggedString]);
            } else {
                process.stdout.write.apply(process.stdout, [loggedString]);
            }
        });
    }

    each_flush(callbackPerItem) {
        this.flush().forEach(callbackPerItem);
    }

    unhook() {
        process.stdout.write = this.old_stdout_write;
        process.stderr.write = this.old_stderr_write;
    }
}

function createProcessOutputJailer() {
    return new ProcessOutputJailer();
}

module.exports.jailProcessOutput = createProcessOutputJailer;