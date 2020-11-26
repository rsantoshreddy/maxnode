const Sequelize = require('sequelize');

const sequelize = new Sequelize('max-node', 'root', '152207', {
  dialect: 'mysql',
  host: 'localhost',
});

module.exports = sequelize;
