const fs = require('fs');
const inquirer = require('inquirer');
const { jobsFilePath, entriesFilePath } = require('../common');

async function deleteJobs() {
  // Load the existing jobs from the JSON file
  let jobs = [];
  if (fs.existsSync(jobsFilePath)) {
    const jobsData = fs.readFileSync(jobsFilePath);
    jobs = JSON.parse(jobsData);
  }

  if(!jobs.length){
    console.log('No jobs exist.');
    return;
  }
  // Load the existing entries from the JSON file
  let entries = [];
  if (fs.existsSync(entriesFilePath)) {
    const entriesData = fs.readFileSync(entriesFilePath);
    entries = JSON.parse(entriesData);
  }
  // Prompt the user to select a job code to delete
  const jobCodes = jobs.map((job) => job.code);
  const { selectedJobCode } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedJobCode',
      message: 'Select a job code to delete:',
      choices: jobCodes,
    },
  ]);

  // Prompt the user to choose whether to preserve entries or remove all entries
  const { deleteEntries } = await inquirer.prompt([
    {
      type: 'confirm',
      name: 'deleteEntries',
      message: 'Deleting this job will remove all entries assigned to this job code. Do you want to continue?',
      default: true,
    },
  ]);

  // Remove the selected job from the jobs list
  const filteredJobs = jobs.filter((job) => job.code !== selectedJobCode);

  // Remove all entries for the selected job code if deleteEntries is false
  let filteredEntries = entries.filter((entry) => entry.jobCode !== selectedJobCode);

  if (!deleteEntries) {
    return;
  }

  // Write the filtered jobs and entries to their respective files
  fs.writeFileSync(jobsFilePath, JSON.stringify(filteredJobs));
  fs.writeFileSync(entriesFilePath, JSON.stringify(filteredEntries));

  console.log(`Job ${selectedJobCode} deleted`);
}

module.exports = deleteJobs;
