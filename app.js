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
