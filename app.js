const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const http = require('http');

const adminData = require('./routes/admin');
const shopRouter = require('./routes/shop');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', adminData.productRouter);
app.use(shopRouter);

app.use((req, res, next) => {
  res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
});

app.listen(9000);

// const server = http.createServer(app);
// server.listen(9000, () => {
//   console.log('Server Started at 9000');
// });
