const fs = require('fs');
const { clientsFilePath, jobsFilePath, entriesFilePath } = require('../common');
const Table = require('cli-table');
const inquirer = require('inquirer');
const chalk = require('chalk');

async function showJobsForClient() {
    // Load the existing clients from the JSON file
    let clients = [];
    if (fs.existsSync(clientsFilePath)) {
        const clientsData = fs.readFileSync(clientsFilePath);
        clients = JSON.parse(clientsData);
    }
    // Load the existing entries from the JSON file
    let entries = [];
    if (fs.existsSync(entriesFilePath)) {
        const entriesData = fs.readFileSync(entriesFilePath);
        entries = JSON.parse(entriesData);
    }
    // Load the existing jobs from the JSON file
    let jobs = [];
    if (fs.existsSync(jobsFilePath)) {
        const jobsData = fs.readFileSync(jobsFilePath);
        jobs = JSON.parse(jobsData);
    }
    // Prompt the user to select a client, or choose 'all' to show all jobs
    const clientChoices = [
        { name: 'All jobs', value: null },
        ...clients.map((client) => ({
        name: client.name,
        value: client,
        })),
    ];
    const { selectedClient } = await inquirer.prompt([
        {
        type: 'list',
        name: 'selectedClient',
        message: 'Select a client:',
        choices: clientChoices,
        },
    ]);

    // Filter the jobs to only include those for the selected client (if any)
    let clientJobs = jobs;

    if (selectedClient) {
        clientJobs = jobs.filter((job) => job.clientName === selectedClient.name);
    }

    // Create a new table object with the appropriate headers
    const table = new Table({
        head: ['Code', 'Name', 'Client', 'Total Hours', 'Total Billable (£)', 'Running'],
    });

    
    // Initialize variables for total elapsed time and money made
    let totalElapsedSeconds = 0;
    let totalMoneyMade = 0.00;

    // Add each job to the table
    clientJobs.forEach((job) => {
        // Filter the entries to only include those for the selected job code
        const jobEntries = entries.filter((entry) => (entry.jobCode === job.code) && entry.endTime);
        // Calculate the total elapsed time and add each entry to the table
        let jobElapsedSeconds = 0;
        jobEntries.forEach((entry) => {
            const startTime = new Date(entry.startTime);
            const endTime = new Date(entry.endTime);
            const elapsedSeconds = Math.round((endTime - startTime) / 1000);
            jobElapsedSeconds += elapsedSeconds;
            totalElapsedSeconds += elapsedSeconds;
        });

        const totalHours = (jobElapsedSeconds / 3600).toFixed(2);
        const hourlyRate = clients.find((client) => client.name === job.clientName).hourlyRate;
        const moneyMade = hourlyRate * totalHours;
        totalMoneyMade += moneyMade;

        // Color the "Running" column based on the job status
        const runningStatus = job.isRunning ? chalk.green('Yes') : chalk.red('No');

        table.push([job.code, job.name, job.clientName, totalHours, moneyMade.toFixed(2), runningStatus]);
    });

    console.log(table.toString(), '\n');
    console.log(`Total Hours: ${(totalElapsedSeconds / 3600).toFixed(2)}`, '\n');
    console.log(`Money Made: £${totalMoneyMade.toFixed(2)}`, '\n');
}

module.exports = showJobsForClient;
