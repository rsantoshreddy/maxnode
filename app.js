const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));

app.use((req, res, next) => {
  next();
});

app.use('/add-product', (req, res, next) => {
  res.send(` <form action="/product" method="POST">
  <input type="text" name="message" />
  <button type="submit">Add</button>
</form>`);
});

app.post('/product', (req, res, next) => {
  console.log(req.body);
  res.redirect('/');
});

app.use('/', (req, res, next) => {
  res.send('<h1>Helo from express</h1>');
});

app.listen(9000);

// const server = http.createServer(app);
// server.listen(9000, () => {
//   console.log('Server Started at 9000');
// });
