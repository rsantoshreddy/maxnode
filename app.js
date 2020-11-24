const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
// const expressHandleBars = require('express-handlebars');

const productRouter = require('./routes/admin');
const shopRouter = require('./routes/shop');
const app = express();

// =========ejs Configurations==========
app.set('view engine', 'ejs');
app.set('views', 'views');

// =========HandleBars Configurations==========
// app.engine(
//   'hbs',
//   expressHandleBars({ extname: '.hbs', defaultLayout: 'layout' })
// ); // this has to be defined as this engine is not defined in express
// app.set('view engine', 'hbs');
// app.set('views', 'views');

// =========PUG Configurations==========
// app.set('view engine', 'pug');
// app.set('views', 'views');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/admin', productRouter);
app.use(shopRouter);

app.use((req, res, next) => {
  // res.status(404).sendFile(path.join(__dirname, 'views', '404.html'));
  res.status(404).render('404', { title: 'Page not found' });
});

app.listen(9000);
// ===========Basics=============
// const http = require('http');
// const app = (req, res) => {
//   console.log(req);
//   // process.exit()
//   res.setHeader('Content-Type', 'text/html');
//   res.write('<html>');
//   res.write('<head><title>My First Page</title></head>');
//   res.write('<body>Hello from node js server</body>');
//   res.write('</html>');
//   res.end();
// };
// const server = http.createServer(app);
// server.listen(9000, () => {
//   console.log('Server Started at 9000');
// });
