const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'text.txt');
const wstream = fs.createWriteStream(filePath, { flags: 'a' });
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('Введите текст (введите "exit" или нажмите Ctrl+C для завершения):');

const exit = () => {
  wstream.end('\n');
  wstream.on('close', () => {
    console.log('\x1b[36m\nУра, вы создали text.txt и записали в него текст!\x1b[37m');
    rl.close();
  });
};

rl.on('line', (input) => {
  if (input.trim() === 'exit') {
    exit();
    return;
  }

  wstream.write(input + '\n');

  console.log('Текст сохранён. Введите снова:');
});

rl.on('SIGINT', () => {
  exit();
});