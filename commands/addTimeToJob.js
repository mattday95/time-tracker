const fs = require('fs');
const { jobsFilePath, entriesFilePath } = require('../common');
const inquirer = require('inquirer');
const moment = require('moment');

async function addTimeToJob() {
  // Load the existing jobs from the JSON file
  let jobs = [];
  if (fs.existsSync(jobsFilePath)) {
    const jobsData = fs.readFileSync(jobsFilePath);
    jobs = JSON.parse(jobsData);
  }

  // Prompt the user to select a job code
  const jobChoices = jobs.map((job) => ({ name: `${job.code} - ${job.name}`, value: job }));
  const { selectedJob } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedJob',
      message: 'Select a job:',
      choices: jobChoices,
    },
  ]);

  // Prompt the user to enter the number of hours to add
  const { hoursToAdd } = await inquirer.prompt([
    {
      type: 'number',
      name: 'hoursToAdd',
      message: `Enter the number of hours to add to job ${selectedJob.code}:`,
      validate: (input) => input > 0 || 'Please enter a positive number',
    },
  ]);

  // Load the existing entries from the JSON file
  let entries = [];
  if (fs.existsSync(entriesFilePath)) {
    const entriesData = fs.readFileSync(entriesFilePath);
    entries = JSON.parse(entriesData);
  }

  // Find the entries for the selected job
  const jobEntries = entries.filter((entry) => entry.jobCode === selectedJob.code);

  // Calculate the start time and end time for the new entry
  const lastEntry = jobEntries[jobEntries.length - 1];
  const startTime = lastEntry ? moment(lastEntry.endTime) : moment();
  const endTime = startTime.clone().add(hoursToAdd, 'hours');

  // Add the new entry to the entries array
  const newEntry = {
    jobCode: selectedJob.code,
    startTime: startTime.toISOString(),
    endTime: endTime.toISOString(),
  };
  entries.push(newEntry);

  // Update the entries file
  fs.writeFileSync(entriesFilePath, JSON.stringify(entries, null, 2));

  console.log(`Added ${hoursToAdd} hours to job ${selectedJob.code} - ${selectedJob.name}`);
}

module.exports = addTimeToJob;