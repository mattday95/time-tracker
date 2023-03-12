const { clients } = require('../common');
const Table = require('cli-table');

module.exports = () => {
    if (clients.length > 0) {
          // Create a new table object with the appropriate headers
        const table = new Table({
            head: ['Name', 'Address', 'Hourly Rate (£)'],
        });
        clients.forEach((client) => {
            table.push([client.name, client.address, client.hourlyRate.toFixed(2)]);
        });
        console.log(table.toString(), '\n');
      } else {
        console.log('No clients found.');
      }
}