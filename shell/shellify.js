const out = o=>process.stdout.write(o);
const className = o=>o.__proto__.constructor.name;
const ShellSet = require('./shellset');

function shellify(resultInstance) {
    const objType = className(resultInstance);
    const shell = new ShellSet;
    let shellString = shell.stringBuilder();

    if (objType==='ProjectListResult') {
        shell.addMessage(
            shellString
                .underline('').bold('Available projects:')
                .plain('')
                .break(2)
                .each(resultInstance.data(), function(item, index, _){
                    _.plain(`${index + 1}) ${item.absPath}`)
                    .break()
                    .plain('··')
                    .plain(` Aliases: `).bold(`[${item.aliases.join(', ')}]`)
                    .break();
                })
                .build()
        );
    } else if (objType === 'ExactProjectResult') {
        shell.addCd(resultInstance.getPath());
    } else if (objType === 'AddedResult') {
        shell.addMessage(
            'I added stuff you know'
        );

        /*console.log('echo "', resultInstance.data() , '"');
        process.exit(0);*/


    } else if (objType === 'ErrorResult') {
        shell.addMessage(
            shellString
                .each(resultInstance.getErrors(), function({text, childMessages}, index, _){
                    _.bold(`${text}:`)

                    if (childMessages && Array.isArray(childMessages)) {
                        _.break(1);
                        _.each(childMessages, function(msg, i, __) {
                            __.plain(`····  ${msg}`);
                        });
                    }
                })
                .build()
        );

    }

    out(shell.toString());
    //console.log(resultInstance.getShellSet().toString());
    //out(':');
}

module.exports = shellify;