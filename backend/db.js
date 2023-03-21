const { Pool } = require('pg');

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'management',
    password: 'a123456',
    port: 5432,
  });
  
  module.exports = pool;