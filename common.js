const fs = require('fs');
const path = require('path');

// Define the path to the clients.json file
const clientsFilePath = path.join(__dirname, 'clients.json');

let clients = [];

try {
  // Read the clients.json file and parse its contents into an array of clients
  const clientsData = fs.readFileSync(clientsFilePath);
  clients = JSON.parse(clientsData);
} catch (error) {}

// Define the path to the jobs.json file
const jobsFilePath = path.join(__dirname, 'jobs.json');

// Define the path to the jobs.json file
const entriesFilePath = path.join(__dirname, 'entries.json');

module.exports = {
  clients,
  jobsFilePath,
  clientsFilePath,
  entriesFilePath
};