const inquirer = require('inquirer');
const fs = require('fs');
const { clients, clientsFilePath } = require('../common');
// Define the 'create-client' command
module.exports = () => {

    const questions = [
      {
        type: 'input',
        name: 'name',
        message: 'Enter the client name:',
      },
      {
        type: 'input',
        name: 'address',
        message: 'Enter the client address:',
      },
      {
        type: 'input',
        name: 'hourlyRate',
        message: 'Enter the hourly rate (£):',
        validate: (input) => {
          if (/^\d+(\.\d{1,2})?$/.test(input)) {
            return true;
          } else {
            return 'Please enter a valid hourly rate (£)';
          }
        },
      },
    ];
  
    inquirer.prompt(questions).then((answers) => {
      const client = {
        name: answers.name,
        address: answers.address,
        hourlyRate: Number(answers.hourlyRate),
      };
  
      clients.push(client);
  
      fs.writeFileSync(clientsFilePath, JSON.stringify(clients));
  
      console.log(`Client ${client.name} created successfully!`);
    });
  }