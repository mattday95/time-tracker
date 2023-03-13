const inquirer = require('inquirer');
const fs = require('fs');
const { clients, clientsFilePath, jobsFilePath, entriesFilePath } = require('../common');

// Define the 'remove-clients' command
module.exports = () => {
  // Load the existing jobs from the JSON file
  let jobs = [];
  if (fs.existsSync(jobsFilePath)) {
    const jobsData = fs.readFileSync(jobsFilePath);
    jobs = JSON.parse(jobsData);
  }
  // Load the existing entries from the JSON file
  let entries = [];
  if (fs.existsSync(entriesFilePath)) {
    const entriesData = fs.readFileSync(entriesFilePath);
    entries = JSON.parse(entriesData);
  }

  const questions = [
    {
      type: 'checkbox',
      name: 'clients',
      message: 'Select the clients to remove:',
      choices: clients.map(client => ({ name: client.name, value: client })),
      validate: (input) => {
        if (input.length === 0) {
          return 'Please select at least one client.';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'confirm',
      message: 'Are you sure you want to remove the selected clients? This will delete all jobs and entries associated with those clients.',
      choices: ['Yes', 'No'],
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    if (answers.confirm === 'Yes') {
      const selectedClients = answers.clients;
      const selectedClientNames = selectedClients.map(client => client.name);

      const filteredJobs = jobs.filter(job => !selectedClientNames.includes(job.clientName));
      const filteredEntries = entries.filter(entry => {
        const relatedJob = jobs.find(job => job.code === entry.jobCode);
        return !selectedClientNames.includes(relatedJob.clientName);
      });
      const filteredClients = clients.filter(client => !selectedClientNames.includes(client.name));

      fs.writeFileSync(clientsFilePath, JSON.stringify(filteredClients));
      fs.writeFileSync(jobsFilePath, JSON.stringify(filteredJobs));
      fs.writeFileSync(entriesFilePath, JSON.stringify(filteredEntries));

      console.log(`Selected clients removed successfully!`);
    } else {
      console.log('Operation cancelled.');
    }
  });
};
