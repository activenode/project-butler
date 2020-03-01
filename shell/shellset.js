const BASH_STYLES = {
    none: '\\033[0m',
    underline: '\\033[4m',
    red: '\\033[0;31m',
    cyan: '\\033[0;36m',
    yellow: '\\033[0;43m',
    bgBlack: '\\e[100m',
    bold: '\\033[1m',
    white: '\\033[0;37m'
}

function generateLineBreaks(numLineBreaks) {
    return Array.apply(null, {length: numLineBreaks}).map(()=>'\\n').join('')
}

class ShellCd {
    constructor(path) {
        this.path = path;
    }

    toString() {
        return `cd ${this.path}`;
    }
}

class ShellRaw {
    constructor(rawCommand) {
        this.rawCommand = rawCommand;
    }

    toString() {
        return this.rawCommand;
    }
}

/**
 * Echo Shell command
 */
class ShellEcho {
    constructor(msg, type) {
        this.message = msg;
        this.type = type;
    }

    toString(mode) {
        let prefixString = '';
        if (this.type==='error') {
            prefixString = '[ERROR] ';
        }
        return `printf "${BASH_STYLES.bold}${prefixString}${this.message}${BASH_STYLES.none}"`;
    }
}

class ShellSet {
    constructor() {
        this.cmdSet = [];
    }

    addRaw(rawCommand) {
        if (!rawCommand) {
            return;
        }
        this.cmdSet.push(new ShellRaw(rawCommand));
    }

    addCd(path) {
        this.cmdSet.push(new ShellCd(path));
    }

    addMessage(msg) {
        this.cmdSet.push(new ShellEcho(msg));
    }

    stringBuilder(inpStr) {
        if (!inpStr) inpStr = '';

        return {
            acc: inpStr ? inpStr : '',
            plain: function(str){
                this.acc += `${inpStr}${BASH_STYLES.none}${str}`;
                return this;
            },
            bold: function(str){
                this.acc += `${inpStr}${BASH_STYLES.bold}${str}`;
                return this;
            },
            underline: function(str){
                this.acc += `${inpStr}${BASH_STYLES.underline}${str}`;
                return this;
            },
            break: function(num) {
                num = num ? num : 1;
                this.acc += generateLineBreaks(num);
                return this;
            },
            each: function(array, iterFunc) {
                array.forEach((item, index)=>{
                    iterFunc(item, index, this);
                })
                return this;
            },
            build: function(){
                return this.acc;
            }
        }
    }

    addErrorMessage(msg) {
        this.cmdSet.push(new ShellEcho(msg, 'error'));
    }

    toString() {
        return this.cmdSet.map((cmd, index)=>cmd.toString(index%2)).join(' && ');
    }
}

module.exports = ShellSet;