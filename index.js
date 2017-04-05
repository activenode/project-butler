#!/usr/bin/env node

const cli = require('commander'),
    osHomedir = require('os-homedir'),
    fs = require('fs'),
    path = require('path'),
    io = require('./io'),
    Database = require('./database'),
    getCWD = process.cwd;

const _self = {
    name: 'clipm',
    dataDir: '.clipmdata'
};
const homedir = osHomedir();
if (!homedir) {
    console.log('ERROR: Home Directory could not be resolved'), process.exit(1);
}

const managerRootDir = `${homedir}/${_self.dataDir}`;
const managerDataFile = `${managerRootDir}/storage`;

function ensureFSExistence(fsPath, syncOnNotExistFunc = (path) => {
    fs.mkdirSync(path)
}, bSecondTry = false) {
    if (fs.existsSync(fsPath)) return;
    if (bSecondTry) throw new Error(`EACCESS could not create  ${fsPath}`);

    try {
        syncOnNotExistFunc(fsPath), ensureFSExistence(fsPath, null, true);
    } catch (e) {
        if (e.syscall && e.syscall == 'mkdir') {
            console.error(`${fsPath} could not be created. Make sure that ${homedir} exists and is writeable`);
        } else {
            console.error(e);
        }
        process.exit(1);
    }

}

ensureFSExistence(managerRootDir);
ensureFSExistence(managerDataFile, (path) => { fs.closeSync(fs.openSync(path, 'w')) });

//----------------------------------------

const fileIO        = io.open(managerDataFile);
const db            = Database(fileIO, path.sep);

// cli.version("0.0.1")
//   .option("-H, --host <host>", "server host")
//   .command("sub")
//   .action((inf)=>{})

cli.version('0.1.0').usage("[options] [command]");

cli
    .command('add [aliases...]')
    .option('-d, --dir [path]', 'Directory to add. Default: CWD')
    .alias('a')
    .description('Adds current directory.')
    .action((aliases) => {
        const absPath = path.resolve(cli.dir || getCWD());

        db.addProject(absPath, aliases)
            .then(res=>{
                //console.log('added');
            })
    });

cli.command('*')
    .description('Open project')
    .action((project) => {
        if (cli.args.length == 2) {
            console.log('pr', cli.args[0]);
            db.matchProjectByLazyString(cli.args[0])
                .then(resultObj=>{
                    
                })
        }
    });

const args = cli.parse(process.argv).args;
if (!args || args.length == 0) {
    db.debug();
}

// console.log('the-args', cli.args);


//TODO: p update-aliases emb emb1 emb2 --> will overwrite the first match of emb with aliases emb1 and emb2 which means :
// only emb1 and emb2 will be left.
//other option: p -d /some add newaliases