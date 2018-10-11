const fs = require('fs');
const path = require('path');

module.exports = {
    getCurrentDirectoryBase : () => {
        return path.basename(process.cwd());
    },

    directoryExists : (filePath) => {
        try {
            return fs.statSync(filePath).isDirectory();
        } catch (err) {
            return false;
        }
    },

    findFile : (startPath, filter) => {

        var results = [];
    
        var files = fs.readdirSync(startPath);

        for(var i = 0; i < files.length; i++){
            var filename=path.join(startPath,files[i]);

            var stat = fs.lstatSync(filename);

            if (stat.isDirectory()){
                results = results.concat(module.exports.findFile(filename,filter)); 
            }
            else if (filename.indexOf(filter) >= 0) {
                results.push(filename);
            }
        }

        return results;
    }
};