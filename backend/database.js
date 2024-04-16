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
  res.set('Access-Control-Allow-Origin', '*');
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
  API POST Endpoint for deleting data from the 'supplements' table.
*/
app.post('/api/deleteSupplement', async (req, res) => {
    const { supplementid } = req.body;
    try {
      await pool.query('DELETE FROM supplements WHERE supplementid = $1', [supplementid]);
      res.status(200).json({ message: 'Successfully deleted a Supplement.' });
    } catch (err) {
      console.error('Error executing query:', err);
      res.status(500).json({ error: 'Internal Server Error' });
    }
});


/*
  API POST/DELETE Endpoint for adding/removing a Supplement to the 'userTakesSupplement' table.
*/
app.post('/api/StarredSupplement', async (req, res) => {
  const { supplementid, isStarred, user_id } = req.body;

  try {
      if (!user_id) {
          return res.status(400).json({ error: 'Invalid userID.' });
      }

      if (isStarred) {  
          await pool.query('INSERT INTO takes (user_id, supplementid) VALUES ($1, $2)', [user_id, supplementid]);
          res.status(200).json({ message: 'Successfully added a favorite supplement.' });
      }
      
      if (!isStarred) {
          await pool.query('DELETE FROM takes WHERE user_id = $1 AND supplementid = $2', [user_id, supplementid]);
          res.status(200).json({ message: 'Successfully deleted a favorite supplement.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API GET Endpoint for fetching all 'takes' (user take supplement) entries with a matching user_ID.
*/
app.get('/api/takes/:user_id', async (req, res) => {
  const userId = req.params.user_id;

  try {
      const result = await pool.query('SELECT * FROM takes WHERE user_id = $1', [userId]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
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
  API GET Endpoint for retrieving all data from the 'meal_plan' table
*/
app.get('/api/mealplan', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meal_plan');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/userprogram/:dailymealplanid/dailymealplan', async (req, res) => {
  const dailyMealPlanID = req.params.dailymealplanid;

  try {
    const programQuery = {
      text: `
          SELECT 
                  mp.meal_plan_id,
                  mp.ispublic,
                  mp.description,
                  mp.owner,
                  dmp.daily_meal_id,
                  dmp.day,
                  m.mealid,
                  m.mealname,
                  m.cooktime,
                  m.prepTime,
                  m.description,
                  m.receipeingredientquantity,
                  m.recipeingredientparts,
                  m.calories,
                  m.fatcontent,
                  m.carbohydratecontent,
                  m.proteincontent,
                  m.saturatedfatcontent,
                  m.cholesterolcontent,
                  m.sodiumcontent,
                  m.fibercontent,
                  m.sugarcontent,
                  m.recipeservings,
                  m.recipeyield,
                  m.recipeinstructions
              FROM 
                  meal_plan mp
              JOIN 
                  daily_meal_plan dmp ON dmp.meal_plan_id = mp.meal_plan_id
              JOIN 
                  dailymealplanhasmeal dmpm ON dmpm.daily_meal_id = dmp.daily_meal_id
              JOIN
                  meal m ON meal.mealid = dmp.mealid
              WHERE 
                  up.userprogramid = $1
          `,
      values: [dailyMealPlanID]
    };

    const result = await pool.query(programQuery);
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API GET Endpoint for retrieving all data from the 'userprogram' table.
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
  res.set('Access-Control-Allow-Origin', '*');
  const nutritionPlanItem = req.body;

  //console.log("Received workoutItem:", workoutItem); //TODO: Debugging purposes

  res.status(200).json({ message: 'NutritionPlanItem received successfully.' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Insert UserProgram first, retrieve the UserProgramID
    const insertNutritionPlanQuery = `
        INSERT INTO nutrition_plan (calorie_goal, diet_type, protein_goal, fat_goal, carb_goal)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING nutrition_plan_id
    `;
    const nutritionPlanValues = [nutritionPlanItem.calorie_goal, nutritionPlanItem.diet_type, nutritionPlanItem.protein_goal, nutritionPlanItem.fat_goal, nutritionPlanItem.carb_goal];
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

/*
  API POST Endpoint for deleting data from the 'nutrition_plan' table.
*/
app.post('/api/deleteNutritionPlan', async (req, res) => {
  const { nutrition_plan_id } = req.body;
  try {
    await pool.query('DELETE FROM nutrition_plan WHERE nutrition_plan_id = $1', [nutrition_plan_id]);
    res.status(200).json({ message: 'Successfully deleted a Nutrition Plan.' });
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API POST Endpoint for editing data from the 'nutrition_plan' table.
*/
app.post('/api/nutritionPlanEdit', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const nutritionPlanItem = req.body;

  //console.log("Received workoutItem:", workoutItem); //TODO: Debugging purposes

  res.status(200).json({ message: 'NutritionPlanItem received successfully.' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Insert UserProgram first, retrieve the UserProgramID
    const editNutritionPlanQuery = 
      `UPDATE nutrition_plan
          SET calorie_goal = $1,
              diet_type = $2,
              protein_goal = $3,
              fat_goal = $4,
              carb_goal = $5 
          WHERE nutrition_plan_id = $6
          RETURNING nutrition_plan_id;`;
    console.log(editNutritionPlanQuery);
    const nutritionPlanValues = [nutritionPlanItem.calorie_goal, nutritionPlanItem.diet_type, nutritionPlanItem.protein_goal, nutritionPlanItem.fat_goal, nutritionPlanItem.carb_goal, nutritionPlanItem.nutrition_plan_id];
    //const { rows } = await client.query(insertUserProgramQuery, userProgramValues);
    //const nutritionPlanID = rows[0].nutrition_plan_id;
    await client.query(editNutritionPlanQuery, nutritionPlanValues);

    await client.query('COMMIT');
} catch (error) {
    await client.query('ROLLBACK');
    throw error;
} finally {
    client.release();
}
});

/*
  API POST/DELETE Endpoint for adding/removing a nutritionPlan to the 'userfollowsnutritionplan' table.
*/
app.post('/api/StarredNutritionPlan', async (req, res) => {
  const { nutrition_plan_id, isStarred, userID } = req.body;

  try {
      if (!userID) {
          return res.status(400).json({ error: 'Invalid userID.' });
      }

      if (isStarred) {  
          await pool.query('INSERT INTO userfollowsnutritionplan (userid, nutrition_plan_id) VALUES ($1, $2)', [userID, nutrition_plan_id]);
          res.status(200).json({ message: 'Successfully added a favorite nutrition plan.' });
      }
      
      if (!isStarred) {
          await pool.query('DELETE FROM userfollowsnutritionplan WHERE userid = $1 AND nutrition_plan_id = $2', [userID, nutrition_plan_id]);
          res.status(200).json({ message: 'Successfully deleted a favorite nutrition plan.' });
      }
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API GET Endpoint for fetching all 'userfollowsnutritionplan' entries with a matching userID.
*/
app.get('/api/userfollowsnutritionplan/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const result = await pool.query('SELECT * FROM userfollowsnutritionplan WHERE userid = $1', [userId]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API GET Endpoint for fetching all 'usertable' entries with a matching userID.
*/
app.get('/api/usertable/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const result = await pool.query('SELECT * FROM usertable WHERE userid = $1', [userId]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API POST Endpoint for editing data from the 'usertable' table.
*/
app.post('/api/userSettingEdit', async (req, res) => {
  res.set('Access-Control-Allow-Origin', '*');
  const userSettingItem = req.body;

  //console.log("Received workoutItem:", workoutItem); //TODO: Debugging purposes

  res.status(200).json({ message: 'UserSettingItem received successfully.' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Insert UserProgram first, retrieve the UserProgramID
    const editUserSettingQuery = 
      `UPDATE usertable
          SET username = $1,
              password = $2,
              firstname = $3,
              lastname = $4,
              email = $5,
              phone = $6,
              bday = $7,
              weight = $8
          WHERE userid = $9
          RETURNING userid;`;
    console.log(editUserSettingQuery);
    const userSettingValues = [userSettingItem.username, userSettingItem.password, userSettingItem.firstname, userSettingItem.lastname, userSettingItem.email, userSettingItem.phone, userSettingItem.bday, userSettingItem.weight, userSettingItem.userid];
    await client.query(editUserSettingQuery, userSettingValues);

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