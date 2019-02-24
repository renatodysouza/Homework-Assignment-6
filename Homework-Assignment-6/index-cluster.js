/*
*
* Primary file for the api 
*/

// Dependencies
const server = require('./lib/server');
const works = require('./lib/workers');
const os = require('os');
const cluster = require('cluster');

// Declare the app
const app = {};

// Init function
app.init = function () {

  if (cluster.isMaster) {

    // Start the workers
    works.init();

    for(let i = 0; i< os.cpus().length; i++) {

      cluster.fork();
    }

  } else {

    // Start the server
    server.init();

  }



};

// Execute function
app.init();

// Export the app
module.exports = app;
