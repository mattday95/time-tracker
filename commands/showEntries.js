const fs = require('fs');
const { clientsFilePath, jobsFilePath, entriesFilePath } = require('../common');
const Table = require('cli-table');
const inquirer = require('inquirer');
const moment = require('moment');

async function showEntries() {
    // Load the existing entries from the JSON file
    let entries = [];
    if (fs.existsSync(entriesFilePath)) {
        const entriesData = fs.readFileSync(entriesFilePath);
        entries = JSON.parse(entriesData);
    }

    // Prompt the user to select a time frame for displaying entries
    const timeFrameChoices = [
        { name: 'All entries', value: 'all' },
        { name: 'Today\'s entries', value: 'today' },
        { name: 'This month\'s entries', value: 'thisMonth' }
    ];
    const { selectedTimeFrame } = await inquirer.prompt([
        {
            type: 'list',
            name: 'selectedTimeFrame',
            message: 'Select a time frame for displaying entries:',
            choices: timeFrameChoices,
        },
    ]);

    // Filter the entries based on the selected time frame
    let filteredEntries = entries;
    if (selectedTimeFrame === 'today') {
        filteredEntries = entries.filter(entry => moment(entry.startTime).isSame(moment(), 'day'));
    } else if (selectedTimeFrame === 'thisMonth') {
        filteredEntries = entries.filter(entry => moment(entry.startTime).isSame(moment(), 'month'));
    }

    // Create a new table object with the appropriate headers
    const table = new Table({
        head: ['Job Code', 'Start Time', 'End Time', 'Elapsed Time (hrs)'],
    });

    // Add each entry to the table
    filteredEntries.forEach(entry => {
        const jobCode = entry.jobCode || '-';
        const startTime = moment(entry.startTime).format('DD/MM/YYYY HH:mm:ss');
        const endTime = entry.endTime ? moment(entry.endTime).format('DD/MM/YYYY HH:mm:ss') : '-';
        const elapsedTime = entry.endTime ? ((new Date(entry.endTime) - new Date(entry.startTime)) / 3600000).toFixed(2) : '-';

        table.push([jobCode, startTime, endTime, elapsedTime]);
    });

    console.log(table.toString(), '\n');
}

module.exports = showEntries;