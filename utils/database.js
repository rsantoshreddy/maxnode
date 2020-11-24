const mysql = require('mysql2');

const pool = mysql.createPool({
    host:'localhost',
    user:'root',
    database:'max-node',
    password:'152207'
})

module.exports = pool.promise();