#!/usr/bin/env node

const figlet = require('figlet');
const chalk = require('chalk');

const files = require('./src/files');
const inquirer = require('./src/inquirer');
const github = require('./src/github');
const repo = require('./src/repo');
const frapp = require('./src/frapp');

/* Title Display */

console.log(
    chalk.cyan(
        figlet.textSync('FRAPP', { horizontalLayout: 'default' })
    )
);

const config = async () => {

    const getGithubToken = async () => {
        // Fetch token from config store
    
        let token = github.getStoredGithubToken();
        if(token) {
          return token;
        }
      
        // No token found, use credentials to access GitHub account
    
        await github.setGithubCredentials();
      
        // register new token
    
        token = await github.registerNewToken();
        return token;
    }
    
    if(!files.directoryExists('frapp')) {
        console.log(chalk.magenta('Create Frapp Project:'));

        const dir = files.getCurrentDirectoryBase();

        const frappconfig = await frapp.askFrappConfig(dir);
        
        const createFrapp = frapp.createFrapp(frappconfig);

        if(createFrapp) {
            console.log(chalk.green('\nFrapp Ready!\n'));
        } else {
            console.log(chalk.red('\nError occured in creating your frapp!\n'));
        }
    }
    
    if (!files.directoryExists('.git')) {
        console.log(chalk.magenta('Create Github Repository:'));
        
        try {
            // Retrieve & Set Authentication Token
    
            const token = await getGithubToken();
            github.githubAuth(token);
    
            // Create remote repository
    
            const repoDetails = await repo.createRemoteRepo();
    
            // Set up local repository
    
            const done = await repo.setupRepo(repoDetails.url);
    
            if(done) {
                console.log(chalk.green('\nRemote Repository Created!\n'));
            }
    
        } catch(err) {
            if (err) {
                switch (err.code) {
                case 401:
                    console.log(chalk.red('\nCouldn\'t log you in. Please provide correct credentials/token.\n'));
                    break;
                case 422:
                    console.log(chalk.red('\nThere already exists a remote repository with the same name.\n'));
                    break;
                default:
                    console.log(err);
                }
            }
        }
    }

}

const run = async () => {
    const argv = require('minimist')(process.argv.slice(2));

    if(argv._[0] == 'new') {
        config();
    }

    if (files.directoryExists('.git') 
        && files.directoryExists('frapp')) {
        
        if(argv._[0] == 'order') {
            frapp.createPatch(argv);
        }

    }
    
}

run();