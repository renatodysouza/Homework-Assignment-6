/*
*
*
*  Handlers
*
*
*/

// Dependencies
const handlers = {};


handlers.hello =  function(data, callback) {

    callback(200, {'msg': 'Hello world'});


}


handlers.notFound = function (data, callback) {

    callback(200, {'msg': 'Not found'});
}




// export module
module.exports = handlers;