const readJson = require('./readJson');

function parsePackageJson(packageJsonPath) {
    const jsonObj = readJson(packageJsonPath);

    let packageJson = { ...jsonObj };

    packageJson.getScript = scriptName => {
        if (packageJson.scripts && packageJson.scripts[scriptName]) {
            return packageJson.scripts[scriptName];
        } else {
            return null;
        }
    };

    return packageJson;
}

module.exports = parsePackageJson;