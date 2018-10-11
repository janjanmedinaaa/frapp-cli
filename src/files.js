const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const pkg = require('../package.json');

const inquirer = require('./inquirer');

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

    createFrapp : (config) => {
        try {
            fs.mkdirSync('./frapp'); // Create Main Frapp folder

            fs.mkdirSync('./frapp/screenshots'); // Create Screenshots folder
    
            fs.mkdirSync('./frapp/apk'); // Create APK folder
    
            /* Create app.json */
    
            let tags = config.tags.split(" "); // Convert Tags to array
            config.tags = tags;

            let data = JSON.stringify(config, null, 2);  
            fs.writeFileSync('./frapp/app.json', data); 

            let patch = JSON.stringify([], null, 2); // Create Patch JSON
            fs.writeFileSync('./frapp/apk/patch.json', patch); 

            return true;
        } catch(err) {
            return false;
        }
    },

    createPatch : async (patch) => {
        console.log(chalk.magenta('Create Frapp Order:'));

        try {
            const notes = (fs.existsSync('./frapp/apk/patch.json')) ? 
            JSON.parse(fs.readFileSync('./frapp/apk/patch.json')) : [];

            const date = new Date();

            const patchinfo = await inquirer.askPatchInfo(patch);

            patchinfo.date = date;

            notes.push(patchinfo);

            let data = JSON.stringify(notes, null, 2);  
            fs.writeFileSync('./frapp/apk/patch.json', data); 

            console.log(chalk.green('\nYour Frapp Order is ready!\n'));
        } catch (err) {
            throw new err;
        }
    }
};