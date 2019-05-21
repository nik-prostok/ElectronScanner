/* eslint-disable no-unused-vars */
// eslint-disable-next-line no-unused-vars
import { app, BrowserWindow, ipcMain, Menu, dialog } from 'electron'; // eslint-disable-lint
import watch from 'node-watch';

import getData from './getData';
import addCol from './addCol';
import addRow from './addRow';
import delCol from './delCol';
import delRow from './delRow';
import editCol from './editCol';
import editRow from './editRow';

let mainWindow;

const template = [
  {
    label: 'Вид',
    submenu: [
      {
        role: 'reload',
        label: 'Перезагрузить',
      },
      {
        role: 'toggledevtools',
        label: 'Режим разработчика',
      },
      {
        type: 'separator',
      },
      {
        type: 'separator',
      },
      {
        role: 'togglefullscreen',
        label: 'На полный экран',
      },
    ],
  },
  {
    role: 'About',
    label: 'Справка',
    submenu: [
      {
        label: 'Открыть помощь',
        click() {
          mainWindow.webContents.send('getHelp');
        },
      },
    ],
  },
  {
    label: 'Редактор',
    submenu: [
      {
        label: 'Добавить колонку',
        click() {
          mainWindow.webContents.send('callAddColModal');
        },
      },
      {
        label: 'Добавить строку',
        click() {
          mainWindow.webContents.send('callAddRowModal');
        },
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);

/**
 * Set `__static` path to static files in production
 * https://simulatedgreg.gitbooks.io/electron-vue/content/en/using-static-assets.html
 */
if (process.env.NODE_ENV !== 'development') {
  // eslint-disable-next-line no-underscore-dangle
  global.__static = require('path')
    .join(__dirname, '/static')
    .replace(/\\/g, '\\\\'); // eslint-disable-line
}

const winURL =
  process.env.NODE_ENV === 'development'
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
    minWidth: 500,
    minHeight: 200,
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
    mainWindow.webContents.send('data', getData());
  }
});

ipcMain.on('callChooseFile', (event, arg) => {
  event.sender.send(
    `call${arg}`,
    dialog.showOpenDialog({ properties: ['openDirectory'] })[0],
  );
});

ipcMain.on('get-data', (event) => {
  event.sender.send('data', getData());
  const data = getData();
  data.rows.forEach((row) => {
    watch(
      row.path,
      {
        recursive: true,
      },
      (evt, name) => {
        console.log('%s changed.', name);
        // mainWindow.webContents.send('data', getData());
      }
    );
  });
});

ipcMain.on('editCol', (event, arg) => {
  editCol(arg);
  event.sender.send('status', 200);
});

ipcMain.on('delCol', (event, arg) => {
  delCol(arg);
  event.sender.send('status', 200);
});

ipcMain.on('newCol', (event, arg) => {
  console.log(arg);
  addCol(arg);
  event.sender.send('status', 200);
});

ipcMain.on('newRow', (event, arg) => {
  addRow(arg);
  event.sender.send('status', 200);
});

ipcMain.on('editRow', (event, arg) => {
  editRow(arg);
  event.sender.send('status', 200);
});

ipcMain.on('delRow', (event, arg) => {
  delRow(arg);
  event.sender.send('status', 200);
});
