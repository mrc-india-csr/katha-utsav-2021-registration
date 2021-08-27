const { Pool } = require('pg');
const config = require('../config');

console.log('config.userName', config.userName)
const pool = new Pool({
  user: config.userName,
  host: config.host,
  database: config.databaseName,
  password: config.password,
  port: config.port,
});

module.exports = {
  pool
};