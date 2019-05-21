const fs = require('fs');
const _ = require('underscore');
const path = require('path');
// const config = require('./../../config.json');

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

export default function getData() {
  let config = [];
  let data = {};
  config = fs.readFileSync('./config.json');
  config = JSON.parse(config);
  const rows = [];
  config.rows.forEach((row, rowIndex) => {
    rows.push([]);
    rows[rowIndex] = {};
    rows[rowIndex].path = row.path;
    rows[rowIndex].addPath = row.addPath;
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
          // (row.addPath);
          row.addPath.forEach((namePath, ind) => {
            rows[rowIndex].addPath[ind].name = `${
              namePath.name
            } ${getMostRecentFileName(`${row.path}/${namePath.name}`)}`;
          });
        }
      }
    });
  });
  data = {
    items: rows,
    headers: config.columns,
    rows: config.rows,
  };
  return data;
}
