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
      return fs.statSync(fullpath).mtime;
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
    config.columns.forEach((col) => {
      if (col.name === 'name') {
        rows[rowIndex] = ({
          name: row.name,
        });
      } else {
        rows[rowIndex][col.name] = getMostRecentFileName(`${row.path}/${col.name}`);
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
