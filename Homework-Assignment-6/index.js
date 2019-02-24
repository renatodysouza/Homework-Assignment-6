/*
*
* Primary file for the api
*/


// Dependencies
const server = require('./server');
const http = require('http');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const path = require('path');

const cluster = require('cluster');
const os = require('os');



// Declare the app
const app = {};

// Init function
app.init = function () {

    if (cluster.isMaster) {

        for (let i= 0; i < os.cpus().length; i++) {

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