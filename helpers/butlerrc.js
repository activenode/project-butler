function readButlerRc(absPath) {
    try {
        const butlerRcConfig = require(absPath);
        return butlerRcConfig || {};
    } catch (e) {
        console.error('.butlerrc.js read failed!');
        return null;
    }
}

module.exports.readButlerRc = readButlerRc;