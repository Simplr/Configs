const path = require('path');

function getProjectDirectory() {
    let dir = path.dirname(require.main.filename).split(path.sep);
    dir.pop(); // Remove bin
    console.log(dir);
    return dir.join(path.sep);
}

exports.getProjectDirectory = getProjectDirectory;
