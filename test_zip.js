const fs = require('fs');
const zlib = require('zlib');
const yauzl = require('yauzl');

yauzl.open('backend_archive_phase6.zip', {lazyEntries: true}, function(err, zipfile) {
  if (err) throw err;
  zipfile.readEntry();
  zipfile.on('entry', function(entry) {
    if (/\/schema\.prisma$/.test(entry.fileName)) {
      zipfile.openReadStream(entry, function(err, readStream) {
        if (err) throw err;
        let chunks = [];
        readStream.on('data', c => chunks.push(c));
        readStream.on('end', () => console.log(Buffer.concat(chunks).toString('utf8')));
      });
    } else {
      zipfile.readEntry();
    }
  });
});
