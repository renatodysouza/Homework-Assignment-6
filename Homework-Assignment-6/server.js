

/* 
*
* Server related tasks
*
*/

// Dependencies

const http = require('http');
const path = require('path');
const url = require('url');
const stringDecoder = require('string_decoder').StringDecoder;
const config = require('./config');
const fs = require('fs');
const handlers = require('./handlers');
const cluster = require('cluster');


// Instantiate the server module object
const server = {};



// Server respost instantiate the http
server.Http = http.createServer(function (req, res) {
    server.unifiedServer(req, res);
});


// Parse a json string to object in all case, whithou trowning
server.parseJsonToObject = function (str) {
    try {
        const obj = JSON.parse(str);
        return obj;
    } catch (error) {
        return {};
    }

}


// All the server logic for both the http and https server
server.unifiedServer = function (req, res) {
    // Get url and parse it
    const parsedUrl = url.parse(req.url, true);

    // Get the path
    const path = parsedUrl.pathname;
    const trimmedPath = path.replace(/^\/+|\/+$/g, '');


    // Get query string as an object
    const queryString = parsedUrl.query;

    // Get http method
    const method = req.method.toLowerCase();

    // Get header as an object
    const headers = req.headers;

    // Get payload, if any
    const decoder = new stringDecoder('utf-8');
    var buffer = '';

    req.on('data', function (data) {
        buffer += decoder.write(data);

    });

    req.on('end', function () {
        buffer += decoder.end();

        // Choose the handlers, if not found, use notFound handler
        const chooseHandler = typeof (server.router[trimmedPath]) !== 'undefined' ? server.router[trimmedPath] : handlers.notFound;
        // Constructing objects to send to the handler   
        const data = {
            'trimmedPath': trimmedPath,
            'queryString': queryString,
            'method': method,
            'headers': headers,
            'payload': server.parseJsonToObject(buffer)
        }


        // Route the request specified in the router

        chooseHandler(data, function (statusCode, payload) {

            // Use status code the handler, or default 200
            statusCode = typeof (statusCode) == 'number' ? statusCode : 200;

            // Use payload code the handler, or default to empty object
            payload = typeof (payload) == 'object' ? payload : {};

            // Convert payload to a string
            const payloadString = JSON.stringify(payload);

            // Return json
            res.setHeader('Content-Type', 'application/json');
            // Return the reponse
            res.writeHead(statusCode);
            res.end(payloadString);

            // if status code is different 200, show console.log
            if(statusCode !== 200) {
                console.log('','Method: '+method.toUpperCase()+'\n'+' path: '+trimmedPath+'\n status code: '+statusCode);
            }
        });
 
    });
};

 // Define a request router

server.router = {
   'hello': handlers.hello,

}


// Init server
server.init = function () {
    // Start http server

    server.Http.listen(config.httpPort, function () {
        // if 
        console.log('The server is listening on port:',`(Worker #${cluster.worker.id})`);

    });
   
};


// Export server
module.exports = server;