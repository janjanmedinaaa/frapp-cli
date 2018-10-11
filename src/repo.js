const _           = require('lodash');
const fs          = require('fs');
const git         = require('simple-git')();
const CLI         = require('clui')
const Spinner     = CLI.Spinner;

const inquirer    = require('./inquirer');
const gh          = require('./github');
const files       = require('./files');

module.exports = {
    createRemoteRepo: async () => {
        const github = gh.getInstance();
        const dir = files.getCurrentDirectoryBase();
        const answers = await inquirer.askRepoDetails(dir);

        const data = {
            name : answers.name,
            description : answers.description,
            private : (answers.visibility === 'private')
        };

        const status = new Spinner('Creating remote repository...');
        status.start();

        try {
            const response = await github.repos.create(data);

            const ret = {
                url: response.data.ssh_url,
                name: data.name,
                description: data.description,
            }

            return ret;

        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    },

    setupRepo: async (url) => {
        const status = new Spinner('Initializing local repository...');
        status.start();
    
        try {
            await git
                .init()
                .add('./*')
                .commit('Initial commit')
                .addRemote('origin', url);
                // .push('origin', 'master');

            return true;
        } catch(err) {
            throw err;
        } finally {
            status.stop();
        }
    },
}