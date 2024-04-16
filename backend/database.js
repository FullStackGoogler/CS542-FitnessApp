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

/*
  API GET Endpoint for retrieving all data from the 'meal' table.
*/
app.get('/api/meal', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM meal');
    res.json(result.rows);
  } catch (err) {
    console.error('Error executing query:', err);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.get('/api/mealplan/:dailymealplanid/dailymealplan', async (req, res) => {
  const dailyMealPlanID = req.params.dailymealplanid;

  try {
    const programQuery = {
      text: `
          SELECT 
                  mp.meal_plan_id,
                  mp.ispublic,
                  mp.name,
                  mp.description,
                  mp.owner,
                  dmp.daily_meal_id,
                  dmp.day,
                  dmpm.servings,
                  m.mealid,
                  m.mealname,
                  m.cooktime,
                  m.prepTime,
                  m.description,
                  m.recipeingredientquantities,
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
                  meal m ON m.mealid = dmpm.mealid
              WHERE 
                  mp.meal_plan_id = $1
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

app.get('/api/userfollowsmealplan/:userId', async (req, res) => {
  const userId = req.params.userId;

  try {
      const result = await pool.query('SELECT * FROM userfollowsmealplan WHERE userid = $1', [userId]);
      res.json(result.rows);
  } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ error: 'Internal Server Error' });
  }
});

/*
  API POST Endpoint for inserting a complete MealPlan into the required tables.
*/
app.post('/api/mealItem', async (req, res) => {
  const mealPlanItem = req.body;

  console.log("Received mealItem:", mealPlanItem); //TODO: Debugging purposes

  res.status(200).json({ message: 'MealItem received successfully.' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Insert MealPlan first, retrieve the mealplanid
    const insertUserProgramQuery = `
        INSERT INTO meal_plan (ispublic, owner, description, name)
        VALUES (true, $1, $2, $3)
        RETURNING meal_plan_id;
    `;
    const userProgramValues = [mealPlanItem.owner, mealPlanItem.description, mealPlanItem.name];
    const { rows } = await client.query(insertUserProgramQuery, userProgramValues);
    const meal_plan_id = rows[0].meal_plan_id;

    //Insert DailyMealPlan with retrieved meal_plan_id; generate unique dailymealplanid
    for (const dailyMeal of mealPlanItem.dailyMealPlan) {
      const insertdailyMealQuery = `
            INSERT INTO daily_meal_plan (day, meal_plan_id)
            VALUES ($1, $2)
            RETURNING daily_meal_id;
        `;
      const dailyMealValues = [dailyMeal.day, meal_plan_id];
      const dailyMealResult = await client.query(insertdailyMealQuery, dailyMealValues);
      const dailyMealId = dailyMealResult.rows[0].daily_meal_id;

      //Insert dailymealhasmeal with respective retrieved dailyMealID
      for (const meal of dailyMeal.meals) {
        const insertmealQuery = `
                INSERT INTO dailymealplanhasmeal (daily_meal_id, mealid, servings)
                VALUES ($1, $2, $3);
            `;
        const mealValues = [dailyMealId, meal.mealID, meal.servings];
        await client.query(insertmealQuery, mealValues);
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


app.get('/api/userprogram/:meal_plan_id/dailyMeals', async (req, res) => {
  const meal_plan_id = req.params.meal_plan_id;

  try {
    const programQuery = {
      text: `
          SELECT 
                  up.userprogramid,
                  up.ispublic,
                  up.num_days_per_week,
                  up.user_program_name,
                  up.user_program_desc,
                  w.dailyMeal_id,
                  w.dailyMeal_name,
                  w.target_group,
                  w.position AS dailyMealPosition,
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
                  dailyMeal w ON up.userprogramid = w.userprogram_id
              JOIN 
                  meal a ON w.dailyMeal_id = a.dailyMeal
              JOIN 
                  exercise e ON a.exercise = e.exercise_id
              WHERE 
                  up.userprogramid = $1
          `,
      values: [meal_plan_id]
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
app.get('/api/userprogram/:meal_plan_id/dailyMeals', async (req, res) => {
  const meal_plan_id = req.params.meal_plan_id;

  try {
    const programQuery = {
      text: `
          SELECT 
            up.userprogramid,
            up.ispublic,
            up.num_days_per_week,
            up.user_program_name,
            up.user_program_desc,
            w.dailyMeal_id,
            w.dailyMeal_name,
            w.target_group,
            w.position AS dailyMealPosition,
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
            dailyMeal w ON up.userprogramid = w.userprogram_id
          JOIN 
            meal a ON w.dailyMeal_id = a.dailyMeal
          JOIN 
            exercise e ON a.exercise = e.exercise_id
          WHERE 
            up.userprogramid = $1
            `,
          values: [meal_plan_id]
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
app.post('/api/mealPlanItem', async (req, res) => {
  const mealPlanItem = req.body;

  //console.log("Received mealPlanItem:", mealPlanItem); //TODO: Debugging purposes

  res.status(200).json({ message: 'dailyMealItem received successfully.' });

  const client = await pool.connect();

  try {
    await client.query('BEGIN');

    //Insert UserProgram first, retrieve the UserProgramID
    const insertUserProgramQuery = `
        INSERT INTO Userprogram (ispublic, num_days_per_week, user_program_name, user_program_desc, "imageURL", owner)
        VALUES (true, $1, $2, $3, $4, $5)
        RETURNING userprogramid;
    `;
    const userProgramValues = [mealPlanItem.daysPerWeek, mealPlanItem.userProgramName, mealPlanItem.userProgramDescription, mealPlanItem.image, mealPlanItem.userProgramOwner];
    const { rows } = await client.query(insertUserProgramQuery, userProgramValues);
    const meal_plan_id = rows[0].userprogramid;

    //Insert dailyMeals with retrieved UserProgramID; generate unique dailyMealIDs
    for (const dailyMeal of mealPlanItem.dailyMeals) {
      const insertdailyMealQuery = `
            INSERT INTO dailyMeal (dailyMeal_name, target_group, userprogram_id, position)
            VALUES ($1, $2, $3, $4)
            RETURNING dailyMeal_id;
        `;
      const dailyMealValues = [dailyMeal.dailyMealName, dailyMeal.targetGroup, meal_plan_id, dailyMeal.dailyMealPosition];
      const dailyMealResult = await client.query(insertdailyMealQuery, dailyMealValues);
      const dailyMealId = dailyMealResult.rows[0].dailyMeal_id;

      //Insert Activity with respective retrieved dailyMealID
      for (const meal of dailyMeal.activities) {
        const insertmealQuery = `
                INSERT INTO Activity (sets, rpe, exercise, note, reps, rest, dailyMeal, position)
                VALUES ($1, $2, $3, $4, $5, $6, $7, $8);
            `;
        const mealValues = [meal.sets, meal.rpe, meal.exerciseID, meal.notes, meal.reps, meal.restTime, dailyMealId, meal.position];
        await client.query(insertmealQuery, mealValues);
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
app.post('/api/StarreddailyMeal', async (req, res) => {
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

  //console.log("Received mealPlanItem:", mealPlanItem); //TODO: Debugging purposes

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

  //console.log("Received mealPlanItem:", mealPlanItem); //TODO: Debugging purposes

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