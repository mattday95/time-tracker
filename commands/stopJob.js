const fs = require('fs');
const { jobsFilePath, entriesFilePath } = require('../common');

module.exports = () => {
  const code = process.argv[3];
  if (!code) {
    console.log('Please supply a job code');
    return;
  }
  // Load the existing jobs from the JSON file
  let jobs = [];
  if (fs.existsSync(jobsFilePath)) {
    const jobsData = fs.readFileSync(jobsFilePath);
    jobs = JSON.parse(jobsData);
  }

  // Find the job with the given code
  const job = jobs.find((job) => job.code === code);
  if (!job) {
    console.log(`Job with code ${code} not found.`);
    return;
  }

  // Check if the job is currently running
  if (!job.isRunning) {
    console.log(`Job with code ${code} is not running.`);
    return;
  }

  // Find the latest entry for this job code
  let entries = [];
  if (fs.existsSync(entriesFilePath)) {
    const entriesData = fs.readFileSync(entriesFilePath);
    entries = JSON.parse(entriesData);
  }
  const entry = entries
    .filter((entry) => entry.jobCode === code)
    .sort((a, b) => new Date(b.startTime) - new Date(a.startTime))[0];

  // Set the entry's end time
  const now = new Date();
  entry.endTime = now.toISOString();

  // Calculate the elapsed time
  const elapsedSeconds = Math.round((new Date(entry.endTime) - new Date(entry.startTime)) / 1000);

  job.isRunning = false;

  // Update the jobs and entries JSON files
  const jobsData = JSON.stringify(jobs, null, 2);
  fs.writeFileSync(jobsFilePath, jobsData);

  const entriesData = JSON.stringify(entries, null, 2);
  fs.writeFileSync(entriesFilePath, entriesData);

  console.log(`Job with code ${code} stopped after ${elapsedSeconds} seconds.`);
};
