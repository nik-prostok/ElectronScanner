const fs = require('fs');

export default function editRow(labels) {
  fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    config.rows.forEach((row, index, arr) => {
      if (row.name === labels.currentTitleRow) {
        arr[index].name = labels.newTitleRow;
        arr[index].path = labels.newPath;
        arr[index].addPath = labels.newAddPath;
      }
    });
    config = JSON.stringify(config);
    fs.writeFileSync('./config.json', config);
    return 200;
  });
}
