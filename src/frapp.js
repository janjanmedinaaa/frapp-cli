const fs = require('fs');

const inquirer   = require('inquirer');
const chalk = require('chalk');

module.exports = {
    /* Asks user for Frapp Config */

    askFrappConfig: (dir) => {
        const argv = require('minimist')(process.argv.slice(3));

        const questions = [
            {
                type: 'input',
                name: 'app_name',
                message: 'Enter App Name:',
                default: argv._[0] || dir,
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter App Description:',
                default: argv._[1] || null,
            },
            {
                type: 'input',
                name: 'developer',
                message: 'Enter Developer Name:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter Developer Name';
                    }
                }
            },
            {
                type: 'list',
                name: 'apk',
                message: 'Enter Initial APK Location:',
                choices: [ 
                    '/frapp/apk/app_release.apk', 
                    '/app/build/outputs/app-release.apk',
                    '/android/app/build/outputs/apk/app-release.apk' 
                ],
                default: '/frapp/apk/frapp.apk',
            },
            {
                type: 'input',
                name: 'icon',
                message: 'Enter Icon Location:',
                default: '/frapp/apk/icon.png'
            },
            {
                type: 'input',
                name: 'tags',
                message: 'Enter App tags:',
                default: null
            },
        ];

        return inquirer.prompt(questions);
    },

    /* Asks user for Frappatch Details */

    askPatchInfo: (init) => {
        const questions = [
            {
                type: 'input',
                name: 'patch_name',
                message: 'Enter Patch Name:',
                default: init._[1],
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter Patch Name.';
                    }
                }
            },
            {
                type: 'input',
                name: 'patch_desc',
                default: null,
                message: 'Enter Patch Description:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter Patch Description';
                    }
                }
            },
        ];

        return inquirer.prompt(questions);
    },

    /* Create Frappucino baby! */

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

    /* One Order of Frappatch extra cream pls! */

    createPatch : async (patch) => {
        console.log(chalk.magenta('Create Frapp Order:'));

        try {
            const notes = (fs.existsSync('./frapp/apk/patch.json')) ? 
            JSON.parse(fs.readFileSync('./frapp/apk/patch.json')) : [];

            const date = new Date();

            const patchinfo = await module.exports.askPatchInfo(patch);

            patchinfo.date = date;

            notes.push(patchinfo);

            let data = JSON.stringify(notes, null, 2);  
            fs.writeFileSync('./frapp/apk/patch.json', data); 

            console.log(chalk.green('\nYour Frapp Order is ready!\n'));
        } catch (err) {
            console.log(chalk.red('Error occured in ordering!'));
        }
    }
}