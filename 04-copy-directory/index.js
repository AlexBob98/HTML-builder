const fs = require('fs/promises');
const path = require('path')

const folder = (path.join(__dirname, 'files-copy'))
const folderCopy = folder.split('\\');

const { resolve } = require('path');

const src = resolve(__dirname, 'files');
const dest = resolve(__dirname, 'files-copy');

(async function copy(path) {
  try {
    await fs.mkdir(dest, {recursive: true});
    const filesDest = await fs.readdir(dest);
    filesDest.forEach(files => fs.unlink(resolve(dest, files)));

    const filesSrc = await fs.readdir(src);
    console.log('\x1b[32m',`add folder: ${folderCopy[folderCopy.length - 1]}\n\n add files:\n ${filesSrc.join(',\n ')}`,"\x1b[37m")
    
    filesSrc.forEach(files => fs.copyFile(resolve(path, files), resolve(dest, files)));
  } catch (error) {
    console.error("\x1b[31m", 'Oh no, error:', error, "\x1b[37m");
  }
})(src);

