const express = require('express');
const { Pool } = require('pg');

const app = express();

var pool = new Pool({
    user: "postgres",
    password: "DataFitness8!",
    database: "postgres",
    port: 5432,
    host: "finalcs542.cle4qgwiih1x.us-east-2.rds.amazonaws.com",
    ssl: { rejectUnauthorized: false },
});

app.get('/api/exercises', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM Exercise');
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

app.listen(8080, () => {
  console.log('Server is running on port 8080');
});