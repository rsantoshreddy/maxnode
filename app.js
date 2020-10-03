const express = require('express');
const bodyParser = require('body-parser');
const http = require('http');

const adminRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use('/admin', adminRouter);
app.use(shopRouter);

app.use((req, res, next) => {
  res.status(404).send('<h1>Page Not Found</h1>');
});

app.listen(9000);

// const server = http.createServer(app);
// server.listen(9000, () => {
//   console.log('Server Started at 9000');
// });
