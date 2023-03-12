const fs = require('fs');
const inquirer = require('inquirer');
const { entriesFilePath } = require('../common');

module.exports = async () => {
  const code = process.argv[3];

  if (!code) {
    console.log('Please supply a job code');
    return;
  }

  // Load the existing entries from the JSON file
  let entries = [];
  if (fs.existsSync(entriesFilePath)) {
    const entriesData = fs.readFileSync(entriesFilePath);
    entries = JSON.parse(entriesData);
  }

  // Find the entries for the given job code
  const jobEntries = entries.filter((entry) => entry.jobCode === code);

  if (jobEntries.length === 0) {
    console.log(`No entries found for job code ${code}.`);
    return;
  }

  const latestEntry = jobEntries[jobEntries.length - 1];

  if (latestEntry.endTime === null) {
    console.log(`Job with code ${code} is currently running. Please stop the job before deleting entries.`);
    return;
  }

  // Prompt the user to choose which entries to delete
  const choices = [
    { name: 'All entries', value: 'all' },
    { name: 'Latest entry', value: 'latest' },
  ];

  const { selectedOption } = await inquirer.prompt([
    {
      type: 'list',
      name: 'selectedOption',
      message: 'Which entries do you want to delete?',
      choices: choices,
    },
  ]);

  // Delete the selected entries
  if (selectedOption === 'all') {
    entries = entries.filter((entry) => entry.jobCode !== code);
  } else {
    entries.pop();
  }

  // Save the updated entries to the JSON file
  const entriesData = JSON.stringify(entries, null, 2);
  fs.writeFileSync(entriesFilePath, entriesData);

  console.log(`Deleted ${selectedOption} entries for job code ${code}.`);
};
