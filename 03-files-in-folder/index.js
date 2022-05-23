const fs = require('fs');
const path = require('path');
const folder = (path.join(__dirname, 'secret-folder'));

const fold = (path.join(__dirname, 'secret-folder'));
 a = fold.split('\\')
console.log(a[a.length - 1])

console.log('\x1b[36m%s\x1b[0m','File - Extension - Size:', "\x1b[37m")
fs.readdir(folder, (err, files) => {
    files.forEach((file) => {
       const fileName = file.split('.')
       fs.stat((path.join(__dirname, 'secret-folder', file)), (err, stats)=> {
        let fileSizeInBytes = stats.size;
        let kb = fileSizeInBytes / 1024 
        if (stats.isFile()){
        console.log(fileName[0] + ' - ' + fileName[fileName.length - 1] + ' - ' + kb.toFixed(3) + '\x1b[33m%s\x1b[0m', 'KB',"\x1b[37m")
        }
        if (err) throw err;
    })
    });
  });

