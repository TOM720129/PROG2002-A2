// Get the client
const mysql = require('mysql2');
const config = require('./db-config');

// Create the connection to database
const connection = mysql.createConnection(config);

module.exports = connection
