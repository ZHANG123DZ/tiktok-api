const fs = require('fs');
const path = require('path');
const spawn = require('child_process').spawn;

async function backupDatabase() {
    const fileName = `${}.dump.sql`;
  const dumpFileName = path.join(__dirname, '..', 'storage', 'backup-db');

  const writeStream = fs.createWriteStream(dumpFileName);

  const dump = spawn('mysqldump', ['-u', 'admin', '-p password', 'tiktok_dev']);
  dump.stdout
    .pipe(writeStream)
    .on("finish", function () {

    })
    .on("error", function (err) {

    });
}

module.exports = backupDatabase;
