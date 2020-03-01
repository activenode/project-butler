const fs = require('fs');

function readJson(file) {
    try {
        const jsonFileContents = fs.readFileSync(path);
        return JSON.parse(jsonFileContents);
    } catch (e) {
        return null;
    }
}

module.exports = readJson;