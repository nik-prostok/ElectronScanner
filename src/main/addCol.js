const fs = require('fs');

export default function addCol(col) {
  console.log(col);
  fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    config.columns.push(col);
    config = JSON.stringify(config);
    fs.writeFileSync('./config.json', config);
    return 200;
  });
}
