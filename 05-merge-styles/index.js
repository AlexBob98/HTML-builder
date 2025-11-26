const fs = require('fs');
const path = require('path');

const stylesDir = path.join(__dirname, 'styles');
const distDir = path.join(__dirname, 'project-dist');
const bundlePath = path.join(distDir, 'bundle.css');

fs.mkdir(distDir, { recursive: true }, (err) => {
  if (err) return console.error('Не удалось создать project-dist:', err);

  fs.readdir(stylesDir, (err, files) => {
    if (err) return console.error('Ошибка чтения styles:', err);

    let cssFiles = [];
    let checked = 0;

    if (files.length === 0) {
      fs.writeFile(bundlePath, '', () => {
        console.log('\x1b[35mКое-что получилось. Запускай в project-dist/index.html Live Server ;)\x1b[37m');
      });
      return;
    }

    files.forEach(file => {
      const fullPath = path.join(stylesDir, file);
      fs.stat(fullPath, (err, stats) => {
        if (!err && stats.isFile() && path.extname(file) === '.css') {
          cssFiles.push(fullPath);
        }
        checked++;
        if (checked === files.length) {
          processCSSFiles(cssFiles);
        }
      });
    });
  });
});

function processCSSFiles(cssFiles) {
  const writeStream = fs.createWriteStream(bundlePath);
  let index = 0;

  const writeNext = () => {
    if (index >= cssFiles.length) {
      writeStream.end();
      console.log('\x1b[35mКое-что получилось. Запускай в project-dist/index.html Live Server ;)\x1b[37m');
      return;
    }

    const readStream = fs.createReadStream(cssFiles[index], 'utf8');
    readStream.pipe(writeStream, { end: false });

    readStream.on('end', () => {
      writeStream.write('\n');
      index++;
      writeNext();
    });

    readStream.on('error', (err) => {
      console.error('Ошибка чтения CSS-файла:', err);
      writeStream.destroy();
    });
  };

  writeNext();
}