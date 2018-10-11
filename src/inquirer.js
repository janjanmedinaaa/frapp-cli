const inquirer   = require('inquirer');
const files      = require('./files');
const pkg        = require('../package.json');

module.exports = {
    /* Ask user for Credentials */

    askGithubCredentials: () => {
        const questions = [
            {
                name: 'username',
                type: 'input',
                message: 'Enter your GitHub username or e-mail address:',
                validate: function( value ) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your username or e-mail address.';
                    }
                }
            },
            {
                name: 'password',
                type: 'password',
                message: 'Enter your password:',
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter your password.';
                    }
                }
            }
        ];

        return inquirer.prompt(questions);
    },

    /* Ask Repository Details */

    askRepoDetails: (dir) => {
        const argv = require('minimist')(process.argv.slice(2));
    
        const questions = [
            {
                type: 'input',
                name: 'name',
                message: 'Enter a name for the repository:',
                default: argv._[0] || dir,
                validate: function(value) {
                    if (value.length) {
                        return true;
                    } else {
                        return 'Please enter a name for the repository.';
                    }
                }
            },
            {
                type: 'input',
                name: 'description',
                default: argv._[1] || null,
                message: 'Enter a description of the repository:'
            },
            {
                type: 'list',
                name: 'visibility',
                message: 'Public or private:',
                choices: [ 'public', 'private' ],
                default: 'public'
            }
        ];

        return inquirer.prompt(questions);
    },

    askFrappConfig: (dir) => {
        const questions = [
            {
                type: 'input',
                name: 'app_name',
                message: 'Enter App Name:',
                default: dir,
            },
            {
                type: 'input',
                name: 'description',
                message: 'Enter App Description:',
                default: null,
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
    }
}
