var express = require('express');
var app = express();
var http = require('http');

app.use(express.static('public'));

app.get('/', function (req, res) {
  res.send('Hello World!');
});

app.server = http.createServer(app);
app.server.listen(3000, function() {
  console.log("Listening on port 3000")
});


var Gun = require('gun');
var gun = Gun();

gun.wsp(app.server);

// Read `greetings`, saving it to a variable.
var wishes = gun.get('random/123');

// Print the value!
wishes.on(function (update) {
    console.log('Update:', update)
})
