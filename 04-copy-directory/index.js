const fs = require('fs').promises;
const path = require('path');

const srcDir = path.resolve(__dirname, 'files');
const destDir = path.resolve(__dirname, 'files-copy');

async function removeDir(dir) {
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    await Promise.all(
      entries.map(entry => {
        const fullPath = path.join(dir, entry.name);
        return entry.isDirectory()
          ? removeDir(fullPath)
          : fs.unlink(fullPath);
      })
    );
    await fs.rmdir(dir);
  } catch (err) {
    if (err.code !== 'ENOENT') throw err;
  }
}

async function copyDir(src, dest) {
  await fs.mkdir(dest, { recursive: true });
  const entries = await fs.readdir(src, { withFileTypes: true });

  await Promise.all(
    entries.map(entry => {
      const srcPath = path.join(src, entry.name);
      const destPath = path.join(dest, entry.name);
      if (entry.isDirectory()) {
        return copyDir(srcPath, destPath);
      } else {
        return fs.copyFile(srcPath, destPath);
      }
    })
  );
}

(async () => {
  try {
    await removeDir(destDir);
    await copyDir(srcDir, destDir);
    console.log('\x1b[32mПапка успешно скопирована!\x1b[37m');
  } catch (err) {
    console.error('\x1b[31mОшибка:', err.message, '\x1b[37m');
  }
})();