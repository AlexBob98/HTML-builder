const fs = require('fs');
const path = require('path');

const extensions = ".css";
const styles = (path.join(__dirname, 'styles'))
const bundleCss = fs.createWriteStream(path.join(__dirname, 'project-dist', 'bundle.css'));

fs.readdir(styles, (err, data) => {
    data.forEach((files) => {
    if (path.extname(files) === extensions) {
     const stylesCss = fs.createReadStream(path.join(__dirname, 'styles', files),'utf8' );  
    stylesCss.pipe(bundleCss);
    } else if (err) {
      console.log('Ooops, Error:', err)
    }  
    });
    console.log('\n','\x1b[35m','Кое-что получилось. Запускай в project-dist Live Server ;)',"\x1b[37m")
  });
  
 


