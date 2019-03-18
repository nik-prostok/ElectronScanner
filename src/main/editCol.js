const fs = require('fs');

export default function editCol(labels) {
  console.log(labels);
  fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    config.columns.forEach((col, index, arr) => {
      if (col.label === labels.label) {
        arr[index].colHelp = labels.newHelp;
        arr[index].label = labels.newLabel;
      }
    });
    config = JSON.stringify(config);
    fs.writeFileSync('./config.json', config);
    return 200;
  });
}
