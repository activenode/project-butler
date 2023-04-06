const fs = require("fs");
const path = require("path");

/**
 * A function that provides a read, write and close function for a given filepath
 * @return {Object} with read, write, close methods
 */
function readWriteHelper(filePath) {
   return {
      read: () => {
         return new Promise((res, rej) => {
            fs.readFile(filePath, (err, buffer) => {
               if (err) rej(err);
               res(buffer);
            });
         });
      },
      write: (value) => {
         return new Promise((res, rej) => {
            fs.writeFile(filePath, value, (err) => {
               if (err) rej(err);
               res();
            });
         });
      },
      close: (fd) => fs.closeSync(fd),
   };
}

function resolveRelativePath(relativePath) {
   return path.resolve(__dirname, relativePath);
}

module.exports = {
   open: readWriteHelper,
   resolveRelativePath,
};
