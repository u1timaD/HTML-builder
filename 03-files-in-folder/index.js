const fs = require('fs');
const path = require('path');

const secretFolder = path.join(__dirname, 'secret-folder');

fs.readdir(secretFolder, (err, files) => {
  if (err) {
    console.error(err);
    return;
  }

  files.forEach(file => {
    const filePath = path.join(secretFolder, file);

    const fileName = file.replace(/\..+/g, '');
    const fileRas = file.replace(/\w+\./g, '');
	

    fs.stat(filePath, (err, stats) => {
	  const fileSize = stats.size / 1000;
      if (err) {
        console.error(err);
        return;
      }

      if (stats.isFile()) {
        console.log(`${fileName} - ${fileRas} - ${fileSize} kb`);
      }
    });
  });
});
