const fs = require('fs');
const path = require('path');

const filesFolder = `${__dirname}/files`;
const filesCopyFolder = `${__dirname}/files-copy`;

fs.mkdir(filesCopyFolder, { recursive: true }, (err) => {
  if (err) {
    console.log('Не смогли создать папочку((');
    return;
  }

  fs.readdir(filesCopyFolder, (err, files) => {
    if (err) throw err;
  
    for (const file of files) {
      fs.unlink(path.join(filesCopyFolder, file), err => {
        if (err) throw err;
      });
    }
  });

  fs.readdir(filesFolder, (err, files) => {
    if (err) {
      console.log(err);
      return;
    }

    const copyFiles = () => {
      if (files.length === 0) {
        return;
      }

      const file = files.shift();
      const sourcePath = path.join(filesFolder, file);
      const targetPath = path.join(filesCopyFolder, file);

      fs.copyFile(sourcePath, targetPath, (err) => {
        if (err) {
          console.log('Не смогли скопировать');
          return;
        }
        
        copyFiles();
      });
    };
    copyFiles();
  });
  console.log('Всё прошло успешно')
});