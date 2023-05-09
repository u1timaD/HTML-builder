const fs = require('fs');
const path = require('path');

const projectDistFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');

fs.mkdir(projectDistFolder, { recursive: true }, (err) => {
  if (err) throw err;

  // ! Создаём index.html
  fs.writeFile(path.join(projectDistFolder, 'index.html'), '', (err) => {
    if (err) throw err;

  });

  // ! Создаём style.css
  fs.writeFile(path.join(projectDistFolder,'style.css'), '', (err) => {
    if (err) throw err;
  });

  // ! Копируем все стили туда
  fs.readdir(stylesFolder, (err, files) => {
    if(err) {
      console.log('Ошибочка');
    }

    for(const file of files) {
      const reg = /.css/g;

      fs.stat(path.join(stylesFolder, file), (err, status) => {
        if (err) throw err;

        if(status.isFile() && reg.test(file)) {
          fs.readFile(path.join(stylesFolder, file), 'utf-8', (err, data) => {
            if (err) throw err;
            fs.appendFile(path.join(projectDistFolder, 'style.css'), `${data}\n`, (err) => {
              if (err) throw err;
            });
          });
        }
      });
    }
  });

  // ! Создаём папку dist/assets
  fs.mkdir(path.join(projectDistFolder, 'assets'), { recursive: true }, (err) => {
    if (err) throw err;
  });

  fs.readdir(assetsFolder, (err, folders) => {
    if (err) throw err;

    // ! СОЗДАЕМ ПАПКИ В dist/assets {fonts/img/svg}
    for (const folder of folders) {
      fs.mkdir(path.join(projectDistFolder, 'assets', folder), { recursive: true }, (err) => {
        if(err) {
          console.log('не удалось создать');
        }

        // ! УДАЛЕНИЕ ФАЙЛОВ ПЕРЕД СОЗДАНИЕМ ASSETS
      fs.readdir(path.join(projectDistFolder, 'assets', folder), (err, files) => {
        if (err) throw err;

        for (const file of files) {
          fs.unlink(path.join(path.join(projectDistFolder, 'assets', folder, file)), err => {
            if (err) throw err;
          });
        }
      });
    });

      // ! Копируем файлы из assets в dist/assets
      fs.readdir(path.join(assetsFolder, folder), (err, files) => {
        if (err) {
          console.log(err);
          return;
        }

        const copyFiles = () => {
          if (files.length === 0) {
            return;
          }

          const file = files.shift();
          const filesFolderPath = path.join(assetsFolder, folder, file);
          const filesCopyFolderPath = path.join(projectDistFolder, 'assets', folder, file);
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
    }
  });

  // ! Читаем tamplate и добавляем все из него в dist/index.html
  fs.readFile(templateFile, (err, data) => {
    if (err) throw err;
    fs.appendFile(path.join(projectDistFolder, 'index.html'), data , (err) => {
      if (err) throw err;
    });

    // ! Читаем index из dist
    fs.readFile(path.join(projectDistFolder, 'index.html'), 'utf-8', (err, indexData) => {
      if (err) {
        console.log(err);
        return;
      }

      // ! Читаем dir в components
      fs.readdir(componentsFolder, (err, files) => {
        const MASGE = [];
        if (err) throw err;
        for (let i=0; i<=files.length-1; i++) {
          MASGE.push(files[i]);
        }

        // ! Читакем каждый прочитанный файл в разметку index по одному
        let changeIndexData = indexData;
        for (let i=0; i<=MASGE.length-1; i++) {
          fs.readFile(path.join(componentsFolder, MASGE[i]), 'utf-8', (err, block) => {
            if (err) throw err;
            const reg = /.html/g;
            const nameTag = MASGE[i].replace(reg, '').toString();
            const size = `{{${nameTag}}}`.length;
            const findIn = changeIndexData.indexOf(`{{${nameTag}}}`);
            const contentBeforeInsertion = changeIndexData.slice(0, findIn);
            const contentAfterInsertion = changeIndexData.slice(findIn + size, changeIndexData.length);
            const updatedContent = contentBeforeInsertion + `\n${block}` + contentAfterInsertion;
            changeIndexData = updatedContent;

            // ! Добавляем его в разметку по одному
            fs.writeFile(path.join(projectDistFolder, 'index.html'), updatedContent, 'utf-8',(err) => {
              if (err) {
                console.log(err);
                return;
              }
            });
          });
        }
      });
    });
  });
});
