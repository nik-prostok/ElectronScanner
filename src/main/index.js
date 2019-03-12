import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
const fs = require('fs');

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  global.__static = require('path').join(__dirname, '/static').replace(/\\/g, '\\\\') // eslint-disable-line
}

let mainWindow;
const winURL = process.env.NODE_ENV === 'development'
  ? 'http://localhost:9080'
  : `file://${__dirname}/index.html`;

function createWindow() {
  /**
   * Initial window options
   */
  mainWindow = new BrowserWindow({
    height: 563,
    useContentSize: true,
    width: 1000,
  });

  mainWindow.loadURL(winURL);

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// const fs = require('fs');
// const root = fs.readdirSync('./test_dir');
const fields = [[]];
const config = require('./../../config.json');
/* config.headers.forEach((head) => {
  fields.push(head.name);
}); */

/* (file) => {
  fs.stat(file, (err, stat) => {

  }); */

config.rows.forEach((row, indexRow) => {
  config.columns.forEach((col, indexCol) => {
    if (col.name === 'name') {
      fields[indexRow].append(row.name);
    } else {
      const pathFolder = fs.readdirSync(`${row.path}\\${col.name}`);
      console.log(pathFolder);
      pathFolder.sort((a, b) => {
        fs.stat(a, (err, statA) => {
          fs.stat(b, (err, statB) => {
            if (statA.ctime > statB.ctime) return 1;
            if (statA.ctime < statB.ctime) return -1;
          });
        });
      });

      console.log(pathFolder[0]);

      fields[indexRow].append();
    }
  });
});

console.log(fields);

ipcMain.on('get-fields', (event) => {
  event.sender.send('fields', fields);
});

/* const fullPath = `${config.data[4].path}\\${config.headers[4].name}`;
console.log(fullPath); */

/**
 * Auto Updater
 *
 * Uncomment the following code below and install `electron-updater` to
 * support auto updating. Code Signing with a valid certificate is required.
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-electron-builder.html#auto-updating
 */

/*
import { autoUpdater } from 'electron-updater'

autoUpdater.on('update-downloaded', () => {
  autoUpdater.quitAndInstall()
})

app.on('ready', () => {
  if (process.env.NODE_ENV === 'production') autoUpdater.checkForUpdates()
})
 */