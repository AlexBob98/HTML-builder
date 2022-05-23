const fs = require('fs');
const readline = require('readline');
const path = require('path');

const wstream = fs.createWriteStream(path.join(__dirname, 'text.txt'));
const rstream = readline.createInterface(
  { input: process.stdin,
    output: process.stdout
  });

rstream.question('Введите текст \n\x1b[31m(после ввода exit приложение остановится):\n \x1b[37m', (data) => {
  if (data === 'exit'){
    console.log("\x1b[32m",'Упс, text.txt пустой','\x1b[37m');
    rstream.close();
  } 
  else {
    wstream.write(`${data}`);
    console.log('\x1b[33m', '\nФайл text.txt создан, текст записан, можно продолжать, только недолго.', '\n Выход из приложения - exit', "\x1b[37m");

    rstream.on('line', (data) => {
      if (data === 'exit'){
        console.log('\x1b[36m', '\nУра ты создал text.txt и записал в него файл',"\x1b[37m");
        rstream.close();
      } else {
        wstream.write(`\n${data}`);
      }
    });
  }
});

rstream.on('SIGINT', () => {
  console.log('\x1b[36m', '\nУра ты создал text.txt и записал в него файл', "\x1b[37m");
  rstream.close();
});