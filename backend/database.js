require('dotenv').config()
const { Pool } = require('pg');
const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const pool = new Pool({
    user: process.env.DB_USER,
    password: process.env.DB_PWD,
    database: process.env.DB_NAME,
    port: 5432,
    host: process.env.DB_HOST,
    ssl: { rejectUnauthorized: false },
});

app.get('/api/nutritionplan', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Nutrition_Plan');
    res.send(result.rows);
    //res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/supplements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Supplements');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
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
    const result = await pool.query('SELECT usertable.username, userprogram.* FROM userprogram JOIN usertable ON userprogram.owner = usertable.userid');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/userprogram/:userProgramId/workouts', async (req, res) => {
  const userProgramId = req.params.userProgramId;

  try {
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
                  w.position AS workoutPosition,
                  a.activity_id,
                  a.reps,
                  a.sets,
                  a.rpe,
                  a.rest,
                  a.note,
                  a.position,
                  e.exercise_id,
                  e.exercise_name,
                  e.muscle_group,
                  e.equipment,
                  e.video,
                  u.username
              FROM 
                  userprogram up
              JOIN
                  usertable u ON up.owner = u.userid
              JOIN 
                  workout w ON up.userprogramid = w.userprogram_id
              JOIN 
                  activity a ON w.workout_id = a.workout
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

app.post('/api/workoutItem', async (req, res) => {
  const workoutItem = req.body;

  //console.log("Received workoutItem:", workoutItem); //TODO: Debugging purposes

  res.status(200).json({ message: 'WorkoutItem received successfully.' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Insert UserProgram first, retrieve the UserProgramID
    const insertUserProgramQuery = `
        INSERT INTO Userprogram (ispublic, num_days_per_week, user_program_name, user_program_desc, "imageURL", owner)
        VALUES (true, $1, $2, $3, $4, $5)
        RETURNING userprogramid;
    `;
    const userProgramValues = [workoutItem.daysPerWeek, workoutItem.userProgramName, workoutItem.userProgramDescription, workoutItem.image, workoutItem.userProgramOwner];
    const { rows } = await client.query(insertUserProgramQuery, userProgramValues);
    const userProgramId = rows[0].userprogramid;

    //Insert Workouts with retrieved UserProgramID; generate unique WorkoutIDs
    for (const workout of workoutItem.workouts) {
        const insertWorkoutQuery = `
            INSERT INTO Workout (workout_name, target_group, userprogram_id, position)
            VALUES ($1, $2, $3, $4)
            RETURNING workout_id;
        `;
        const workoutValues = [workout.workoutName, workout.targetGroup, userProgramId, workout.workoutPosition];
        const workoutResult = await client.query(insertWorkoutQuery, workoutValues);
        const workoutId = workoutResult.rows[0].workout_id;

        //Insert Activity with respective retrieved WorkoutID
        for (const activity of workout.activities) {
            const insertActivityQuery = `
                INSERT INTO Activity (sets, rpe, exercise, note, reps, rest, workout, position)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `;
            const activityValues = [activity.sets, activity.rpe, activity.exerciseID, activity.notes, activity.reps, activity.restTime, workoutId, activity.position];
            await client.query(insertActivityQuery, activityValues);
        }
    }

    await client.query('COMMIT');
} catch (error) {
    await client.query('ROLLBACK');
    throw error;
} finally {
    client.release();
}
});

app.listen(9000, () => {
  console.log('Server is running on port 9000');
});