# Time Tracker Node.js CLI App

## Installation Steps

1. Clone the repository
2. Run `yarn` or `npm install` to install the required dependencies.
3. Run `npm i -g .` inside the cloned directory in order to make the `tracker` command available globally.

## Commands

Here is a list of all available commands:

* `tracker create-client` creates a new client and adds it to the clients.json file 
* `tracker show-clients` shows all clients
* `tracker remove-clients` allows the user to delete multiple clients
* `tracker create-job` creates a new job and assigns it to a client.
* `tracker delete-job` allows the user to delete jobs and their corresponding entries
* `tracker show-jobs` shows all jobs with the option to filter by client.
* `tracker start-job {job_code}` starts the job and creates a new time entry.
* `tracker stop-job {job_code}` stops the job and sets the end time for the corresponding entry.
* `tracker show-entries` allows the user to see and filter all entries.
* `tracker delete-entries {job_code}` deletes entries for the provided job code.
