/* eslint-disable prefer-const */
/* eslint-disable no-unused-vars */
/* eslint-disable no-restricted-globals */
const fs = require('fs');
const _ = require('underscore');
const path = require('path');
// const config = require('./../../config.json');

function getMostRecentFileName(dir) {
  let files;
  try {
    files = fs.readdirSync(dir);

    const file = _.max(files, (f) => {
      const fullpath = path.join(dir, f);
      // ctime = crwitheation time is used
      // replace  mtime for modification time
      // eslint-disable-next-line space-infix-ops
      return fs.statSync(fullpath).ctime;
    });
    if (file === -Infinity) {
      return 'Пустая папка';
    }
    return file;
  } catch (err) {
    return 'Нет директории';
  }
}

export default function getData() {
  let config = [];
  let data = {};
  const paths = [];
  config = fs.readFileSync('./config.json');
  config = JSON.parse(config);
  const rows = [];
  // let errpath = '';
  config.rows.forEach((row, rowIndex) => {
    // errpath = row.path;
    rows.push([]);
    rows[rowIndex] = {};
    rows[rowIndex].path = row.path;
    rows[rowIndex].addPath = row.addPath;
    try {
      let files = fs.readdirSync(row.path);
      paths.push(row.path);
      config.columns.forEach((col, colIndex, arr) => {
        if (col.label === arr[0].label) {
          rows[rowIndex][`col${colIndex}`] = row.name;
        } else {
          rows[rowIndex][`col${colIndex}`] = getMostRecentFileName(`${row.path}/${col.nameDir}`);
        }
        if (colIndex === arr.length - 1) {
          const index = colIndex + 1;
          rows[rowIndex][`col${index}`] = [];
          if (row.addPath !== undefined) {
            row.addPath.forEach((namePath, ind) => {
              rows[rowIndex].addPath[ind].name = `${
                namePath.name
              } ${getMostRecentFileName(`${row.path}/${namePath.name}`)}`;
            });
          }
        }
      });
    } catch (err) {
      config.columns.forEach((col, colIndex, arr) => {
        if (col.label === arr[0].label) {
          rows[rowIndex][`col${colIndex}`] = row.name;
        } else {
          rows[rowIndex][`col${colIndex}`] = 'Нет корневой директории';
        }
        if (colIndex === arr.length - 1) {
          const index = colIndex + 1;
          row.addPath[0].name = 'Нет корневой директории';
        }
      });
    }
  });

  data = {
    items: rows,
    headers: config.columns,
    rows: config.rows,
    paths,
  };
  return data;
}
