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
    config.columns.forEach((col, colIndex) => {
      if (col.label === 'Имя') {
        rows[rowIndex][`col${colIndex}`] = row.name;
      } else {
        rows[rowIndex][`col${colIndex}`] = getMostRecentFileName(`${row.path}/${col.label}`);
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
