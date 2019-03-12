import { app, BrowserWindow, ipcMain } from 'electron' // eslint-disable-line
const fs = require('fs');
const _ = require('underscore');
const path = require('path');

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

// eslint-disable-next-line no-unused-vars
function getMostRecentFileName(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);
    return _.max(files, (f) => {
      const fullpath = path.join(dir, f);
      // ctime = creation time is used
      // replace with mtime for modification time
      return fs.statSync(fullpath).ctime;
    });
  } catch (err) {
    return 'Not dir';
  }
}

// const root = fs.readdirSync('./test_dir');
const fields = [];
const config = require('./../../config.json');

config.rows.forEach((row, rowIndex) => {
  fields.push([]);
  config.columns.forEach((col) => {
    if (col.name === 'name') {
      fields[rowIndex] = ({
        name: row.name,
      });
    } else {
      fields[rowIndex][col.name] = getMostRecentFileName(`${row.path}/${col.name}`);
    }
    // console.log(getMostRecentFileName(`${row.path}/${col.name}`));
  });
  console.log();
});

console.log(fields);

const data = {
  items: fields,
  headers: config.columns,
  rows: config.rows,
};

ipcMain.on('get-data', (event) => {
  event.sender.send('data', data);
});

/* const fullPath = `${config.data[4].path}\\${config.headers[4].name}`;
console.log(fullPath); */
