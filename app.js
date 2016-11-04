// `http` is a standard library
// built into node.
var http = require('http');

// Create a new server instance.
var server = new http.Server();

// Start the server on port 8080.
server.listen(3003, function () {
  console.log('Server listening on http://localhost:3000/gun')
})

