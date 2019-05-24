const fs = require('fs');

export default function addCol(row) {
  console.log(row);
  fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    row.addPath.forEach((path, index, arr) => {
      if (path.name === '') {
        arr.splice(index, 1);
      }
    });
    config.rows.push(row);
    config = JSON.stringify(config);
    fs.writeFileSync('./config.json', config);
    return 200;
  });
}
