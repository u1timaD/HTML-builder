const fs = require('fs');
const path = require('path');

const projectDistFolder = path.join(__dirname, 'project-dist');
const assetsFolder = path.join(__dirname, 'assets');
const stylesFolder = path.join(__dirname, 'styles');
const componentsFolder = path.join(__dirname, 'components');
const templateFile = path.join(__dirname, 'template.html');

fs.mkdir(projectDistFolder, { recursive: true }, (err) => {
  if (err) throw err;

  const createStyleFile = async () => {
    try {
      // ! Создаем style.css
      await fs.promises.writeFile(path.join(projectDistFolder, 'style.css'), '');

      // Копируем все стили туда
      const files = await fs.promises.readdir(stylesFolder);

      for (const file of files) {
        const reg = /.css/g;

        const status = await fs.promises.stat(path.join(stylesFolder, file));

        if (status.isFile() && reg.test(file)) {
          const data = await fs.promises.readFile(path.join(stylesFolder, file), 'utf-8');
          await fs.promises.appendFile(path.join(projectDistFolder, 'style.css'), `${data}\n`);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  createStyleFile();


  const createAssetsFolder = async () => {
    try {
      // ! Создаем папку dist/assets
      await fs.promises.mkdir(path.join(projectDistFolder, 'assets'), { recursive: true });

      // ! Читаем директорию assets
      const folders = await fs.promises.readdir(assetsFolder);

      // ! Создаем папки в dist/assets {fonts/img/svg}
      for (const folder of folders) {
        await fs.promises.mkdir(path.join(projectDistFolder, 'assets', folder), { recursive: true });

        // ! Удаление файлов перед созданием assets
        const filesToDelete = await fs.promises.readdir(path.join(projectDistFolder, 'assets', folder));
        for (const file of filesToDelete) {
          await fs.promises.unlink(path.join(projectDistFolder, 'assets', folder, file));
        }

        // ! Копирование файлов из assets в dist/assets
        const filesToCopy = await fs.promises.readdir(path.join(assetsFolder, folder));
        for (const file of filesToCopy) {
          const filesFolderPath = path.join(assetsFolder, folder, file);
          const filesCopyFolderPath = path.join(projectDistFolder, 'assets', folder, file);
          await fs.promises.copyFile(filesFolderPath, filesCopyFolderPath);
        }
      }
    } catch (err) {
      throw err;
    }
  };

  createAssetsFolder();

  const createIndexFile = async () => {
    try {
      // ! Создаем index.html
      await fs.promises.writeFile(path.join(projectDistFolder, 'index.html'), '');

      // ! Читаем tamplate и добавляем все из него в dist/index.html
      const data = await fs.promises.readFile(templateFile);
      await fs.promises.appendFile(path.join(projectDistFolder, 'index.html'), data);

      // ! Читаем index из dist
      let indexData = await fs.promises.readFile(path.join(projectDistFolder, 'index.html'), 'utf-8');

      // ! Читаем dir в components
      const files = await fs.promises.readdir(componentsFolder);
      const MASGE = files.map(file => file);

      // ! Читаем каждый прочитанный файл в разметку index по одному
      for (const fileName of MASGE) {
        const block = await fs.promises.readFile(path.join(componentsFolder, fileName), 'utf-8');
        const reg = /.html/g;
        const nameTag = fileName.replace(reg, '').toString();
        const size = `{{${nameTag}}}`.length;
        const findIn = indexData.indexOf(`{{${nameTag}}}`);
        const contentBeforeInsertion = indexData.slice(0, findIn);
        const contentAfterInsertion = indexData.slice(findIn + size, indexData.length);
        const updatedContent = contentBeforeInsertion + `\n${block}` + contentAfterInsertion;
        indexData = updatedContent;

        // ! Добавляем его в разметку по одному
        await fs.promises.writeFile(path.join(projectDistFolder, 'index.html'), updatedContent, 'utf-8');
      }
    } catch (err) {
      throw err;
    }
  };

  createIndexFile();
});
