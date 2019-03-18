const fs = require('fs');

export default function delCol(label) {
  console.log(label);
  fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    config.columns.forEach((col, index, arr) => {
      if (col.label === label) {
        arr.splice(index, 1);
      }
    });
    config = JSON.stringify(config);
    fs.writeFileSync('./config.json', config);
    return 200;
  });
}
