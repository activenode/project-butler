const cli = require('commander'),
    osHomedir = require('os-homedir'),
    fs = require('fs'),
    path = require('path'),
    io = require('./io'),
    ProjectDatabase = require('./db/database'),
    shellify = require('./shell/shellify'),
    getCWD = process.cwd,
    VERSION = '0.3.0';


/**
 * Important:
 * This is an interface layer for an overlaying shell caller.
 * This is because node can only fork/spawn but cannot actually manipulate
 * the open shell.
 */


const _self = {
    name: 'alclipm',
    dataDir: '.alclipmdata'
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
const db            = ProjectDatabase(fileIO, path.sep);

cli.version(VERSION).usage('[options] [command]');

cli
    .command('add [aliases...]')
    .option('-d, --dir [path]', 'Directory to add. Default: CWD')
    .description('Adds current directory.')
    .action((aliases) => {
        const absPath = path.resolve(cli.dir || getCWD());
        db.addProject(absPath, aliases).then(shellify);
    });

cli
    .command('remove [aliases...]')
    .option('-a, --all', 'If --all param is set it will completely remove the directory from the list with all its aliases')
    .description('If no alias is provided it will try to delete all aliases from your current directory')
    .action((aliases) => {
        const absPath = path.resolve(getCWD());

        if (!aliases || aliases.length === 0) {
            db.removeByDirectory(absPath).then(shellify);
        } else {
            db.removeByAliases(aliases, cli.all).then(shellify);
        }

        //db.addProject(absPath, aliases).then(shellify);
    });

cli.command('*')
    .description('Open project')
    .action((project) => {
        if (cli.args.length == 2) {
            db.findBestMatch(cli.args[0]).then(shellify)
        }
    });

const args = cli.parse(process.argv).args;
if (!args || args.length == 0) {
    //db.debug();
    db.fetchAll().then(shellify)
}



//TODO: p update-aliases emb emb1 emb2 --> will overwrite the first match of emb with aliases emb1 and emb2 which means :
// only emb1 and emb2 will be left.
//other option: p -d /some add newaliases