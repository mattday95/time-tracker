#!/usr/bin/env node
const createClient = require('./commands/createClient');
const showClients = require('./commands/showClients');
const removeClients = require('./commands/removeClients');
const createJob = require('./commands/createJob');
const showJobs = require('./commands/showJobs');
const startJob = require('./commands/startJob');
const stopJob = require('./commands/stopJob');
const deleteJob = require('./commands/deleteJob');
const deleteEntries = require('./commands/deleteEntries');
const showEntries = require('./commands/showEntries');
const { clientsFilePath } = require('./common');

const fs = require('fs');

// Check if the clients file exists, and create it if it doesn't
if (!fs.existsSync(clientsFilePath)) {
  fs.writeFileSync(clientsFilePath, '[]');
}
// Register the 'create-client' command
const command = process.argv[2];

if (command === 'create-client') {
  createClient();
} 
// Register the 'show-clients' command
else if (process.argv[2] === 'show-clients') {
    showClients();
}
else if (process.argv[2] === 'remove-clients') {
    removeClients();
}
else if (process.argv[2] === 'create-job') {
    createJob();
}
else if (process.argv[2] === 'show-jobs') {
    showJobs();
}
else if (process.argv[2] === 'start-job') {
    startJob();
}
else if (process.argv[2] === 'stop-job') {
    stopJob();
}
else if (process.argv[2] === 'delete-entries') {
    deleteEntries();
}
else if (process.argv[2] === 'delete-job') {
    deleteJob();
}
else if (process.argv[2] === 'show-entries') {
    showEntries();
}
else {
  console.log(`Invalid command: ${command}`);
}
