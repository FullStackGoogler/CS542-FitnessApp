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

/*
  API GET Endpoint for retrieving all data from the 'nutrition_plan' table.
*/
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

/*
  API GET Endpoint for retrieving all data from the 'supplements' table.
*/
app.get('/api/supplements', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM Supplements');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API GET Endpoint for retrieving all data from the 'exercise' table.
*/
app.get('/api/exercises', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM Exercise');
      res.json(result.rows);
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });

/*
  API GET Endpoint fo retrieving all data from the 'userprogram' table.
*/
app.get('/api/userprograms', async (req, res) => {
  try {
    const result = await pool.query('SELECT usertable.username, userprogram.* FROM userprogram JOIN usertable ON userprogram.owner = usertable.userid');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API GET Endpoint for retrieving the complete User Program data for a specified userprogramID value.
*/
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

/*
  API POST Endpoint for inserting a complete User Program into the required tables.
*/
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

/*
  API POST/DELETE Endpoint for adding/removing a User Program to the 'userfollowsuserprogram' table.
*/
app.post('/api/StarredWorkout', async (req, res) => {
  const { userprogramid, isStarred, userId } = req.body;

  try {
      if (!userId) {
          return res.status(400).json({ error: 'Invalid userID.' });
      }

      if (isStarred) {  
          await pool.query('INSERT INTO userfollowsuserprogram (userid, userprogramid) VALUES ($1, $2)', [userId, userprogramid]);
          res.status(200).json({ message: 'Successfully added a favorite UserProgram.' });
      }
      
      if (!isStarred) {
          await pool.query('DELETE FROM userfollowsuserprogram WHERE userid = $1 AND userprogramid = $2', [userId, userprogramid]);
          res.status(200).json({ message: 'Successfully deleted a favorite UserProgram.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API GET Endpoint for fetching all 'userfollowsuserprogram' entries with a matching userID.
*/
app.get('/api/userfollowsuserprogram/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const result = await pool.query('SELECT * FROM userfollowsuserprogram WHERE userid = $1', [userId]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

//insert Nutrition_Plan
app.post('/api/nutritionPlanItem', async (req, res) => {
  const nutritionPlanItem = req.body;

  //console.log("Received workoutItem:", workoutItem); //TODO: Debugging purposes

  res.status(200).json({ message: 'NutritionPlanItem received successfully.' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Insert UserProgram first, retrieve the UserProgramID
    const insertNutritionPlanQuery = `
        INSERT INTO nutrition_plan (nutrition_plan_id, calorie_goal, diet_type, protein_goal, fat_goal, carb_goal)
        VALUES (true, $1, $2, $3, $4, $5)
        RETURNING nutrition_plan_id
    `;
    const nutritionPlanValues = [nutritionPlanItem.nutrition_plan_id, nutritionPlanItem.calorie_goal, nutritionPlanItem.diet_type, nutritionPlanItem.protein_goal, nutritionPlanItem.fat_goal, nutritionPlanItem.carb_goal];
    //const { rows } = await client.query(insertUserProgramQuery, userProgramValues);
    //const nutritionPlanID = rows[0].nutrition_plan_id;
    await client.query(insertNutritionPlanQuery, nutritionPlanValues);

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