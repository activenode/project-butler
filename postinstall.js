const os = require('os'),
    platform = os.platform(),
    unsupported = ['win32'],
    supportedDownloadableBinaries = ['darwin', 'linux'],
    packageJSON = require('./package.json'),
    repoURL = packageJSON.repository.url,
    version = packageJSON.version,
    assetGitBaseURL = 'https://github.com',
    http = require('https'),
    fs = require('fs');


const baseGitUrl = (repoURL.match(/^.*github\.com(.*)\.git$/))[1];
const binBaseUrl = assetGitBaseURL + baseGitUrl + '/releases/download/' + version + '/bin';

if (unsupported.indexOf(platform) >= 0) {
    console.error('Unsupported system type <' + platform + '>');
    process.exit(1);
}

// now we can fetch the prebuilt binary (as building it on the system will take too long)
const finalBinUrl = binBaseUrl + '.' + platform;
const targetBinPath = 'bin/project-butler';

if (supportedDownloadableBinaries.indexOf(platform) >= 0) {
    console.log('Trying to download binary from ', finalBinUrl);
    const request = http.get(finalBinUrl, function(response) {
        if (response.statusCode !== 200) {
            console.warn('Could not download binary from ', finalBinUrl);
            console.warn('Will bind source js code instead of binary now...');
        } else {
            if (fs.existsSync(targetBinPath)) {
                fs.unlinkSync(targetBinPath);
            }
    
            const file = fs.createWriteStream(targetBinPath);
            response.pipe(file);
        }
    });
} else {
    console.warn('This platform cannot be provided with a prebuilt binary, using source code instead.');
}