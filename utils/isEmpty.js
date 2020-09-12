module.exports = function isEmpty(arg) {
   return (
      (arg !== 0 && !arg) ||
      arg === null ||
      arg === undefined ||
      (Array.isArray(arg) && arg.length == 0) ||
      Object.keys(arg).length == 0
   );
};
