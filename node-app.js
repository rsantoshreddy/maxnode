// const fs = require('fs');

// fs.writeFileSync('Hellow.txt', 'Hi there');

// console.log('Hi there');

const http = require('http');
const router = require('./routes');
const server = http.createServer(router);

server.listen(9000, () => {
  console.log('Server Started at 9000');
});
