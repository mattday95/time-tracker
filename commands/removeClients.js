const inquirer = require('inquirer');
const fs = require('fs');
const { clients, clientsFilePath } = require('../common');

// Define the 'remove-clients' command
module.exports = () => {

    
    const questions = [
        {
          type: 'input',
          name: 'clientNames',
          message: 'Enter the names of the clients to remove (separated by space):',
          validate: (input) => {
            const names = input.trim().toLowerCase().split(' ');
    
            // Check that all entered names exist in the clients list
            for (const name of names) {
              if (!clients.some((client) => client.name.toLowerCase() === name)) {
                return `Client "${name}" not found.`;
              }
            }
    
            return true;
          },
        },
        {
          type: 'list',
          name: 'confirm',
          message: 'Are you sure you want to remove the selected clients?',
          choices: ['Yes', 'No'],
        },
      ];
    
      inquirer.prompt(questions).then((answers) => {
        if (answers.confirm === 'Yes') {
          const names = answers.clientNames.trim().toLowerCase().split(' ');
    
          // Filter out the clients to remove
          const filteredClients = clients.filter(
            (client) => !names.includes(client.name.toLowerCase())
          );
    
          fs.writeFileSync(clientsFilePath, JSON.stringify(filteredClients));
    
          console.log(`Selected clients removed successfully!`);
        } else {
          console.log('Operation cancelled.');
        }
      });
}