const fs = require('fs');

export default function addCol(row) {
  console.log(row);
  fs.readFile('./config.json', (err, data) => {
    if (err) throw err;
    let config = JSON.parse(data);
    config.rows.push(row);
    config = JSON.stringify(config);
    fs.writeFileSync('./config.json', config);
    return 200;
  });
}
