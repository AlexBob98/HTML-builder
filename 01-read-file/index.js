const fs = require('fs');
const path = require('path');

const stream = fs.createReadStream(path.join(__dirname, 'text.txt'), { encoding: 'utf-8' });

stream.on('readable', function () {
  let data;
  while ((data = stream.read()) !== null) {
    console.log(data);
  }
});