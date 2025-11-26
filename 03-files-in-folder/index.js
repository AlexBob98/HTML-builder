const fs = require('fs');
const path = require('path');

const folderPath = path.join(__dirname, 'secret-folder');

fs.readdir(folderPath, (err, files) => {
  if (err) {
    console.error('Не удалось прочитать папку:', err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(folderPath, file);
    console.log(fs);
    fs.stat(filePath, (err, stats) => {
      if (err) {
        return;
      }

      if (stats.isFile()) {
        const { name, ext } = path.parse(file);

        const extension = ext ? ext.slice(1) : '';
        const sizeInKb = (stats.size / 1024).toFixed(3);

        console.log(`${name} - ${extension} - ${sizeInKb}kb`);
      }
    });
  });
});