const fs = require('fs');
const path = require('path');

const filesFolder = path.join(__dirname, 'files');
const filesCopyFolder = path.join(__dirname, 'files-copy');

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
      const filesFolderPath = path.join(filesFolder, file);
      const filesCopyFolderPath = path.join(filesCopyFolder, file);

      fs.copyFile(filesFolderPath, filesCopyFolderPath, (err) => {
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