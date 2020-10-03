const fs = require('fs');

const router = (req, res) => {
  // console.log(req);
  //   process.exit();
  const { url, method } = req;

  if (url === '/message' && method === 'GET') {
    res.write(`<!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0" />
          <title>Document</title>
        </head>
        <body>
          <div>
            <form action="/message" method="POST">
              <input type="text" name="message" />
              <button type="submit">Submit</button>
            </form>
          </div>
        </body>
      </html>
      `);
    return res.end();
  }
  if (url === '/message' && method === 'POST') {
    const {} = req;
    const body = [];
    req.on('data', (chunk) => {
      body.push(chunk);
    });
    return req.on('end', () => {
      const data = Buffer.concat(body).toString();
      console.log(data);
      // fs.writeFileSync('message.txt', data);
      fs.writeFile('message.txt', data, () => {
        res.statusCode = 302;
        res.setHeader('Location', '/message');
        res.end();
      });
    });
  }
  res.setHeader('Content-Type', 'text/html');
  res.write(`<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>
    <body>
        <p>My first page</p>
        <p>Hello from node.js</p>
    </body>
    </html>`);
  res.end();
};

module.exports = router;
