module.exports.log = function () {
   console.log.apply(console.log, arguments);
};

module.exports.logErr = function () {
   console.error.apply(console.error, arguments);
};
