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

app.get('/api/userprograms', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM userprogram');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/userprogram/:userProgramId/workouts', async (req, res) => {
  const userProgramId = req.params.userProgramId;

  try {
      // Query to fetch all data related to the selected user program ID
      const programQuery = {
          text: `
          SELECT 
                  up.userprogramid,
                  up.ispublic,
                  up.num_days_per_week,
                  up.user_program_name,
                  up.user_program_desc,
                  w.workout_id,
                  w.workout_name,
                  w.target_group,
                  a.activity_id,
                  a.sets,
                  a.rpe,
                  e.exercise_id,
                  e.exercise_name,
                  e.muscle_group,
                  e.equipment,
                  e.video
              FROM 
                  userprogram up
              JOIN 
                  userprogramhasworkout uphw ON up.userprogramid = uphw.userprogramid
              JOIN 
                  workout w ON uphw.workout_id = w.workout_id
              JOIN 
                  consists c ON w.workout_id = c.workout_id
              JOIN 
                  activity a ON c.activity_id = a.activity_id
              JOIN 
                  exercise e ON a.exercise = e.exercise_id
              WHERE 
                  up.userprogramid = $1
          `,
          values: [userProgramId]
      };

      const result = await pool.query(programQuery);
      res.json(result.rows);
  } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/userprogram/gre', async (req, res) => {

  try {
      const result = await pool.query('SELECT workout.* FROM workout JOIN userprogramhasworkout ON workout.workout_id = userprogramhasworkout.workout_id WHERE userprogramhasworkout.userprogramid = 1');
      res.json(result.rows);
  } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});


app.listen(8080, () => {
  console.log('Server is running on port 8080');
});