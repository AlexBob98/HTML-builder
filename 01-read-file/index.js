const fs = require('fs');
const path = require('path');

const stream = fs.ReadStream(path.join(__dirname, 'text.txt'),'utf-8');

stream.on('readable', function(){
    let data = stream.read();
    if (data != null) 
    console.log(data);
});