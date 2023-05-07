const fs = require('fs');
const path = require('path');

const projectDist = path.join(__dirname, 'project-dist');
const stylesDist = path.join(__dirname, 'styles');

fs.writeFile(path.join(projectDist, 'bundle.css'), '', (err) => {
  if (err) throw err;

  fs.readdir(stylesDist, (err, files) => {
    if (err) {
      console.log('Ошибочка');
    }

    for (const file of files) {
      const reg = /.css/g;

      fs.stat(path.join(stylesDist, file), (err, status) => {
        if (err) throw err;

        if(status.isFile() && reg.test(file)) {
          fs.readFile(path.join(stylesDist, file), 'utf-8', (err, data) => {
            if (err) throw err;
            fs.appendFile(path.join(projectDist, 'bundle.css'), `${data}\n`, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    }
  });
});
