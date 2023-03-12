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

    // Check if the job is already running
    if (job.isRunning) {
        console.log(`Job with code ${code} is already running.`);
        return;
    }

    // Start the job and update the JSON file
    const now = new Date();
    job.isRunning = true;
    const jobsData = JSON.stringify(jobs, null, 2);
    fs.writeFileSync(jobsFilePath, jobsData);

    // Create an entry object and push it to the entries file
    const entry = { jobCode: code, startTime: now.toISOString(), endTime: null };
    let entries = [];
    if (fs.existsSync(entriesFilePath)) {
        const entriesData = fs.readFileSync(entriesFilePath);
        entries = JSON.parse(entriesData);
    }
    entries.push(entry);
    const entriesData = JSON.stringify(entries, null, 2);
    fs.writeFileSync(entriesFilePath, entriesData);

    console.log(`Job with code ${code} started at ${now.toLocaleString()}.`);
}