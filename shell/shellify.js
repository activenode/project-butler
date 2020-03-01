const out = o => process.stdout.write(o);
const className = o=>o.__proto__.constructor.name;
const ShellSet = require('./shellset');
const fs = require('fs');
const { jailProcessOutput } = require('../helpers/processOutputJailer');
const { readButlerRc } = require('../helpers/butlerrc.js');

function shellify(resultInstance) {
    const jailedProcessOutput = jailProcessOutput();
    
    const objType = className(resultInstance);
    const shell = new ShellSet;
    let shellString = shell.stringBuilder();

    if (objType === 'ProjectListResult'
        || objType === 'SearchProjectListResult') {
        shell.addMessage(
            shellString
                .underline('').bold(resultInstance.title)
                .plain('')
                .break(2)
                .each(resultInstance.data(), function(item, index, _){
                    _.plain(`${index + 1}) ${item.absPath}`)
                    .break()
                    .plain('··')
                    .plain(` Aliases: `).bold(`[${
                        resultInstance.aliasesPreprocess(item.aliases).join(', ')
                    }]`)
                    .break(2);
                })
                .build()
        );
    } else if (objType === 'ExactProjectResult') {
        const lookupButlerRc = `${resultInstance.getPath()}/.butlerrc.js`;
        const rcFileExists = fs.existsSync(lookupButlerRc);
        
        shell.addCd(resultInstance.getPath());

        if (rcFileExists) {
            const butlerRcConfig = readButlerRc(lookupButlerRc);
            if (butlerRcConfig !== null) {
                if (butlerRcConfig.open && typeof butlerRcConfig.open === 'function') {
                    console.log('lel', butlerRcConfig.open());
                    //shell.addRaw(butlerRcConfig.open());
                }
            }
        }
    } else if (objType === 'AddedResult') {
        const {
            aliases,
            absPath
        } = resultInstance.data();

        shell.addMessage(
            shellString
            .plain('Aliases for')
            .break()
            .bold(absPath)
            .plain('')
            .break()
            .each(aliases, (alias, i, _) => {
                _.plain(`· ${alias}`).break();
            })
            .build()
        );
    } else if (objType === 'ErrorResult') {
        shell.addMessage(
            shellString
                .each(resultInstance.getErrors(), function({text, childMessages}, index, _){
                    _.bold(`${text}${childMessages && childMessages.length ? ':' : ''}`)

                    if (childMessages && Array.isArray(childMessages)) {
                        _.break(1);
                        _.each(childMessages, function(msg, i, __) {
                            __.plain(`····  ${msg}`);
                        });
                        _.break();
                    }
                })
                .build()
        );
    }

    jailedProcessOutput.unhook();

    out(shell.toString());
    //console.log(resultInstance.getShellSet().toString());
    //out(':');
}

module.exports = shellify;