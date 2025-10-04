// Get the client
const mysql = require('mysql2');
const config = require('./db-config');

// create connect pool
const pool = mysql.createPool(config);

// use promise
const promisePool = pool.promise();

module.exports = promisePool;
