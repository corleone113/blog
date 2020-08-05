const fs = require('fs');
const path = require('path');
const distServer = path.join(__dirname, 'dist_server');
fs.readdir(distServer, (err, files) => {
    if (err) return console.assert(err);
    for (const file of files) {
        if (/main.+js/.test(file)) {
            fs.readFile(path.join(distServer, file), {
                encoding: 'utf8',
            }, (err, code) => {
                if (err) return console.assert(err);
                eval(code);
            });
        }
    }
});