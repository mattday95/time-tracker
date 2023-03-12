const fs = require('fs');
const inquirer = require('inquirer');
const { clients, clientsFilePath, jobsFilePath } = require('../common');

function generateJobCode() {
    // Generate a random 4-digit code
    const code = Math.floor(1000 + Math.random() * 9000);
    return code.toString();
}

function createJobs() {
  // Prompt the user to enter the job name and select a client
  const questions = [
    {
      type: 'input',
      name: 'jobName',
      message: 'Enter the name of the new job:',
      validate: (input) => {
        // Check that the job name is not empty
        if (input.trim() === '') {
          return 'Please enter a job name.';
        }
        return true;
      },
    },
    {
      type: 'list',
      name: 'clientName',
      message: 'Select a client:',
      choices: clients.map((client) => client.name),
    },
  ];

  inquirer.prompt(questions).then((answers) => {
    const client = clients.find(
      (client) => client.name === answers.clientName
    );

    // Generate a new job code
    const jobCode = generateJobCode();

    // Create a new job object
    const job = {
        code: jobCode,
        name: answers.jobName.trim(),
        clientId: client.id,
        clientName: client.name,
    };

    // Load the existing jobs from the JSON file
    let jobs = [];
    if (fs.existsSync(jobsFilePath)) {
      const jobsData = fs.readFileSync(jobsFilePath);
      jobs = JSON.parse(jobsData);
    }

    // Add the new job to the jobs array
    jobs.push(job);

    // Save the updated jobs array to the JSON file
    fs.writeFileSync(jobsFilePath, JSON.stringify(jobs));

    console.log(`New job "${job.name}" created for client "${client.name}"!`);
  });
}

module.exports = createJobs;