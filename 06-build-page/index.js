const { rm, readdir, readFile, writeFile, mkdir, copyFile, stat } = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'project-dist');
const assetsSrc = path.join(__dirname, 'assets');
const assetsDest = path.join(distDir, 'assets');
const stylesDir = path.join(__dirname, 'styles');
const componentsDir = path.join(__dirname, 'components');
const templatePath = path.join(__dirname, 'template.html');

rm(distDir, { recursive: true, force: true }, (err) => {
  if (err && err.code !== 'ENOENT') return console.error(err);

  mkdir(distDir, (err) => {
    if (err) return console.error(err);

    buildStyles(() => {
      buildHTML(() => {
        copyDir(assetsSrc, assetsDest, (err) => {
          if (err) return console.error(err);
          console.log('\x1b[32mСборка завершена!\x1b[37m');
        });
      });
    });
  });
});

function buildStyles(callback) {
  readdir(stylesDir, (err, files) => {
    if (err) return callback(err);

    const cssFiles = files.filter(file => path.extname(file) === '.css');
    let cssContent = '';
    let completed = 0;

    if (cssFiles.length === 0) {
      writeFile(path.join(distDir, 'style.css'), '', callback);
      return;
    }

    cssFiles.forEach(file => {
      const filePath = path.join(stylesDir, file);
      readFile(filePath, 'utf-8', (err, data) => {
        if (err) return callback(err);
        cssContent += data + '\n';
        completed++;
        if (completed === cssFiles.length) {
          writeFile(path.join(distDir, 'style.css'), cssContent, callback);
        }
      });
    });
  });
}

function buildHTML(callback) {
  readFile(templatePath, 'utf-8', (err, template) => {
    if (err) return callback(err);

    readdir(componentsDir, (err, files) => {
      if (err) return callback(err);

      const htmlComponents = files.filter(file => path.extname(file) === '.html');
      let html = template;
      let completed = 0;

      if (htmlComponents.length === 0) {
        writeFile(path.join(distDir, 'index.html'), html, callback);
        return;
      }

      htmlComponents.forEach(file => {
        const componentName = path.basename(file, '.html');
        const filePath = path.join(componentsDir, file);
        readFile(filePath, 'utf-8', (err, content) => {
          if (err) return callback(err);
          html = html.replace(new RegExp(`{{${componentName}}}`, 'g'), content);
          completed++;
          if (completed === htmlComponents.length) {
            writeFile(path.join(distDir, 'index.html'), html, callback);
          }
        });
      });
    });
  });
}

function copyDir(src, dest, callback) {
  mkdir(dest, { recursive: true }, (err) => {
    if (err) return callback(err);

    readdir(src, (err, entries) => {
      if (err) return callback(err);

      let completed = 0;
      if (entries.length === 0) return callback();

      const done = () => {
        completed++;
        if (completed === entries.length) callback();
      };

      entries.forEach(entry => {
        const srcPath = path.join(src, entry);
        const destPath = path.join(dest, entry);

        stat(srcPath, (err, stats) => {
          if (err) return callback(err);
          if (stats.isFile()) {
            copyFile(srcPath, destPath, (err) => {
              if (err) return callback(err);
              done();
            });
          } else if (stats.isDirectory()) {
            copyDir(srcPath, destPath, (err) => {
              if (err) return callback(err);
              done();
            });
          }
        });
      });
    });
  });
}