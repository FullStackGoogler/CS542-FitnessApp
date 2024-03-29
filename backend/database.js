require('dotenv').config()
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: 5432,
    host: process.env.DB_HOST,
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