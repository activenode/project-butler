const   fs  = require('fs'),
        u   = undefined;

function readWriteHelper ( filePath ) {
    return {
        read: ()=>{
            return new Promise((res, rej)=>{
                fs.readFile(filePath, (err, buffer)=>{
                    if (err) rej(err);
                    res(buffer);
                })
            })
        },
        write: (value)=>{
            return new Promise((res, rej)=>{
                fs.writeFile(filePath, value, (err)=>{
                    if(err) rej(err);
                    res()
                })
            })
        },
        close: (fd) => fs.closeSync(fd)
    }
}

module.exports = {
    open: readWriteHelper
}