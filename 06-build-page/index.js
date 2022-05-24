const {rm, readdir, readFile, writeFile, mkdir, copyFile, stat} = require('fs');
const path = require('path');
const assetsFolder = path.join(__dirname,  'assets');
const assetsCopyFolder = path.join(__dirname, 'project-dist', 'assets');
const extensions = ".css";

// style.css
rm(path.join(__dirname, 'project-dist'), {recursive: true}, (err) => {
  readdir(path.join(__dirname, 'styles'), (err, cssFiles) => {
    if (err) {console.log(err)}
    const array = [];
    const cssFile = cssFiles.filter((item) => {return path.extname(item) === extensions});
    cssFile.forEach((item, i) => {
      const threeCss = path.join(path.join(__dirname, 'styles'), item);
      readFile(threeCss, (err, oneCss) => {
        array[i] = oneCss.toString();
        if (array.length === cssFile.length) {
          writeFile(path.join(__dirname, 'project-dist', 'style.css'), array.reverse().join(''), (err) => {
            if (err)  {console.log(err)}
          })
        }})
    })
  })
// index.html
  mkdir(path.join(__dirname, 'project-dist'), () => {
    readFile(path.join(__dirname, 'template.html').toString(), (err, indexHtml) =>{
      let htmlCode = indexHtml.toString();
      readdir(path.join(__dirname, 'components'), (err, files) => {
        files.forEach(item => {
          readFile(path.join(path.join(__dirname, 'components'), item), (err, indexHtml) => {
            htmlCode = htmlCode.replace(`{{${path.parse(item).name}}}`, indexHtml.toString());
            writeFile(path.join(__dirname, 'project-dist', 'index.html'), htmlCode, (err) => {
              if (err)  {console.log(err)}
            })
          })
        })
      })
    })
  })
  copyFiles(assetsFolder, assetsCopyFolder);
})

//copyFiles
function copyFiles(from, to) {
  rm(to, {recursive: true}, () => {
    mkdir(to, () => {
      readdir(from, (err,files) => {
        files.forEach(element => {
        let src = path.join(from, element);
        let dist = path.join(to, element);
        stat(src, (err, stats) =>{
          if (stats.isFile()) {
               copyFile(src, dist, () => {});
          } else {
            copyFiles(src, dist); 
     }})
    })
   })
  })
 })
}