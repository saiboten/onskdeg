/* eslint no-console: 0 */

const express = require('express');

const app = express();
const http = require('http');

app.use(express.static('public'));

app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.server = http.createServer(app);
app.server.listen(3000, () => {
  console.log('Listening on port 3000');
});
