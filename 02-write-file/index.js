const path = require('path');
const fs = require('fs');
const { stdout, stdin, exit } = process;

const writeStream = fs.createWriteStream(path.join(__dirname, 'text.txt'), 'utf-8');

stdout.write('Привет. Введи какой-нибудь текст: \n');

process.on('SIGINT', () => {
  console.log('До скорой встречи');
  writeStream.end();
  exit();
});

stdin.on('data', data => {
  if(!data.toString().includes('exit')) {
    stdout.write('От души. Можешь ввести ещё что-то: \n');

  } else {
    stdout.write('До скорой встречи');
    writeStream.end();
    exit();
  }
});

stdin.pipe(writeStream);
