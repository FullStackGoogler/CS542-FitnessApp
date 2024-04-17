import { useState, useEffect } from "react";

import { FormControl, InputLabel, Select, MenuItem, Typography, Divider } from "@mui/material";
import IconButton from '@mui/material/IconButton';
import ArrowDropDownCircleIcon from '@mui/icons-material/ArrowDropDownCircle';

import TopBar from "../../Components/TopBar";

import { WorkoutItem } from "../Workouts/Interfaces/WorkoutItem";
import { NutritionPlanItem } from "../NutritionPlans/Interfaces/NutritionPlanItem";
import { SupplementItem } from "../Supplements/Interfaces/SupplementItem";
import { MealPlanItem } from "../Meals/Interfaces/MealPlanItem";

import "./HomePage.css";

const HomePage = () => {
    const [userPrograms, setUserPrograms] = useState<WorkoutItem[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<WorkoutItem | null>(null);

    const [mealPlans, setMealPlans] = useState<MealPlanItem[]>([]);
    const [selectedMealPlan, setSelectedMealPlan] = useState<MealPlanItem | null>(null);

    const [nutritionPlans, setNutritionPlans] = useState<NutritionPlanItem[]>([]);
    const [supplements, setSupplements] = useState<SupplementItem[]>([]);

    const [currentDay, setCurrentDay] = useState<number>(0);
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    const [isProgramsCollapsed, collapsePrograms] = useState(false);
    const [isMealsCollapsed, collapseMeals] = useState(false);
    const [isNutritionsCollapsed, collapseNutritions] = useState(false);
    const [isSupplementsCollapsed, collapseSupplements] = useState(false);

    //Fetch all favorited items by the current user
    useEffect(() => {
        //Fetch all User Programs on page load that the current user has favorited
        fetch('http://localhost:9000/api/userprograms')
            .then(response => response.json())
            .then(data => {
                fetch(`http://localhost:9000/api/userfollowsuserprogram/1`) //TODO: Currently have hardcoded
                    .then(response => response.json())
                    .then(userFollows => {
                        //Filter to only include programs that are favorited
                        const followedProgramIDs = userFollows.map((follow: any) => follow.userprogramid);
    
                        const filteredPrograms = data
                            .filter((program: any) => followedProgramIDs.includes(program.userprogramid))
                            .map((program: any) => ({
                                userProgramID: program.userprogramid,
                                userProgramName: program.user_program_name,
                                userProgramDescription: program.user_program_desc,
                                userProgramOwner: program.username,
                                daysPerWeek: program.num_days_per_week,
                                image: program.imageURL || `https://via.placeholder.com/150/3A795E/FFFFFF/?text=User+Program`,
                                workouts: []
                            }));
    
                        setUserPrograms(filteredPrograms);
                    })
                    .catch(error => console.error('Error fetching user-followed programs:', error));
            })
            .catch(error => console.error('Error fetching user programs:', error));
            
        fetch('http://localhost:9000/api/mealplan')
            .then(response => response.json())
            .then(data => {
                fetch('http://localhost:9000/api/userfollowsmealplan/1') //TODO: Currently have hardcoded
                    .then(response => response.json())
                    .then(userFollows => {
                        const followedPlanIDs = userFollows.map((follow: any) => follow.meal_plan_id);

                        const filteredPlans = data
                            .filter((plan: any) => followedPlanIDs.includes(plan.meal_plan_id))
                            .map((plan: any) => ({
                                mealPlanID: plan.meal_plan_id,
                                owner: plan.owner,
                                name: plan.name,
                                description: plan.description,
                                dailyMealPlan: []
                            }));
                        
                        setMealPlans(filteredPlans);
                    })
            })
            .catch(error => console.error('Error fetching meal plans:', error));

        fetch('http://localhost:9000/api/supplements')
            .then(response => response.json())
            .then(data =>  {
                fetch('http://localhost:9000/api/takes/1')
                    .then(response => response.json())
                    .then(userUses => {
                        const supplementIDsUsed = userUses.map((supplement: any) => supplement.supplementid);

                        const filteredSupplements = data
                            .filter((supplement: any) => supplementIDsUsed.includes(supplement.supplementid))
                            .map((supplement: any) => ({
                                supplementid: supplement.supplementid,
                                product_name: supplement.product_name,
                                product_category: supplement.product_category,
                                product_description: supplement.product_description,
                                brand_name: supplement.brand_name,
                                link:supplement.link,
                                price:supplement.price,
                                price_per_serving:supplement.price_per_serving,
                                overall_rating:supplement.overall_rating,
                                number_of_reviews: supplement.number_of_reviews,
                                verified_buyer_rating: supplement.verified_buyer_rating,
                                verified_buyer_number: supplement.verified_buyer_number,
                                top_flavor_rated: supplement.top_flavor_rated,
                                number_of_flavors: supplement.number_of_flavors,
                                average_flavor_rating: supplement.average_flavor_rating
                            }));

                        setSupplements(filteredSupplements);
                    })
                    .catch(error => console.error('Error fetching user-followed supplements:', error));
            })
            .catch(error => console.error('Error fetching supplements:', error));
        
        fetch('http://localhost:9000/api/nutritionplan')
            .then(response => response.json())
            .then(data =>  {
                fetch('http://localhost:9000/api/userfollowsnutritionplan/1')
                    .then(response => response.json())
                    .then(userFollows => {
                        const followedNutritionPlanIDs = userFollows.map((nutritionPlan: any) => nutritionPlan.nutrition_plan_id);

                        const filteredNutritionPlans = data
                            .filter((nutritionPlan: any) => followedNutritionPlanIDs.includes(nutritionPlan.nutrition_plan_id))
                            .map((plan: any) => ({
                                nutrition_plan_id: plan.nutrition_plan_id,
                                calorie_goal: plan.calorie_goal,
                                diet_type: plan.diet_type,
                                protein_goal: plan.protein_goal,
                                fat_goal: plan.fat_goal,
                                carb_goal: plan.carb_goal
                            }));

                        setNutritionPlans(filteredNutritionPlans);
                    })
                    .catch(error => console.error('Error fetching user-followed nutrition plans:', error));
            })
            .catch(error => console.error('Error fetching nutrition plans:', error));
        
        //Determine the current day
        const today = new Date().getDay();
        setCurrentDay(today);
    }, []);
    

    const handleSelectedProgram = (userProgramID: number) => {
        fetch(`http://localhost:9000/api/userprogram/${userProgramID}/workouts`)
            .then(response => response.json())
            .then(workoutData => {
                //console.log(workoutData);
                const workoutsMap = new Map<number, any>();
    
                workoutData.forEach((workout: any) => {
                    const { workout_id, workout_name, target_group, workoutposition, ...activity } = workout;
                    const activityData = {
                        activityID: activity.activity_id,
                        exerciseName: activity.exercise_name,
                        muscleGroup: activity.muscle_group,
                        reps: activity.reps,
                        sets: activity.sets,
                        rpe: activity.rpe,
                        restTime: activity.rest,
                        notes: activity.note,
                        position: activity.position
                    };
    
                    if (workoutsMap.has(workout_id)) {
                        workoutsMap.get(workout_id).activities.push(activityData);
                    } else {
                        workoutsMap.set(workout_id, {
                            workoutID: workout_id,
                            workoutName: workout_name,
                            targetGroup: target_group,
                            workoutPosition: workoutposition,
                            activities: [activityData]
                        });
                    }
                });
                const workouts = Array.from(workoutsMap.values());
    
                //Find user program with matching userprogramID
                const selectedProgramItem = userPrograms.find(program => program.userProgramID === userProgramID);
    
                //Update the found user prorgam with the fetched data
                if (selectedProgramItem) {
                    setSelectedProgram(prevSelectedProgram => ({
                        ...prevSelectedProgram,
                        ...selectedProgramItem,
                        workouts: workouts
                    }));
                }
            })
            .catch(error => {
                console.error('Error fetching workout data:', error);
            });
    };

    const handleSelectedPlan = (mealPlanID: number) => {
        fetch(`http://localhost:9000/api/mealplan/${mealPlanID}/dailymealplan`)
            .then(response => response.json())
            .then(dailyMealData => {
                console.log(dailyMealData)
                const mealMap = new Map<number, any>();
                dailyMealData.forEach((dailymealplan: any) => {
                    const { daily_meal_id, day, ...meal } = dailymealplan;
                    const meal_data = {
                        mealID: meal.mealid,
                        mealName: meal.mealname,
                        cookTime: meal.cooktime,
                        prepTime: meal.prepTime,
                        description: meal.description,
                        servings: meal.servings,
                        receipeingredientquantity: meal.receipeingredientquantity,
                        recipeingredientparts: meal.recipeingredientparts,
                        calories: meal.calories,
                        fat: meal.fatcontent,
                        carbs: meal.carbohydratecontent,
                        protein: meal.proteincontent,
                        saturatedFat: meal.saturatedfatcontent,
                        cholesterol: meal.cholesterolcontent,
                        sodium: meal.sodiumcontent,
                        fiber: meal.fibercontent,
                        sugar: meal.sugarcontent,
                        recipeServings: meal.recipeservings,
                        recipeYield: meal.recipeyield,
                        recipeInstructions: meal.recipeinstructions
                    };

                    if (mealMap.has(daily_meal_id)) {
                        mealMap.get(daily_meal_id).meals.push(meal_data);
                    } else {
                        mealMap.set(daily_meal_id, {
                            dailyMealPlanID: daily_meal_id,
                            day: day,
                            meals: [meal_data]
                        });
                    }
                });
                const mealplan = Array.from(mealMap.values());

                //Find user program with matching userprogramID
                const selectedPlanItem = mealPlans.find(mealPlan => mealPlan.mealPlanID === mealPlanID);
    
                //Update the found user prorgam with the fetched data
                if (selectedPlanItem) {
                    setSelectedMealPlan(prevSelectedProgram => ({
                        ...prevSelectedProgram,
                        ...selectedPlanItem,
                        dailyMealPlan: mealplan
                    }));
                }
            })
    }
    
    const handleProgramCollapse = () => {
        collapsePrograms(!isProgramsCollapsed);
    };

    const handleMealCollapse = () => {
        collapseMeals(!isMealsCollapsed);
    };

    const handleNutritionCollapse = () => {
        collapseNutritions(!isNutritionsCollapsed);
    };

    const handleSupplementCollapse = () => {
        collapseSupplements(!isSupplementsCollapsed);
    };

    return (
        <div>
            <TopBar title="Home Page" titleColor="#ffffff"/>
            <div style={{ padding: '75px 10px' }}>
                <Typography variant="h4" component="div">
                    Welcome Back!
                </Typography>
                <Typography variant="h6" component="div">
                    Today's Date is: {formattedDate}
                </Typography>
            </div>
            
            <div style={{ padding: '0px 10px' }}> {/* Workout Rendering */}
                <Divider style={{ margin: "20px 0" }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <IconButton onClick={handleProgramCollapse}>
                        <ArrowDropDownCircleIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Select a User Program:
                    </Typography>
                </div>
                {!isProgramsCollapsed && (
                    <div>
                        <FormControl style={{ width: '15%' }}>
                            <InputLabel id="program-select-label">User Program</InputLabel>
                            <Select
                                label="User Program"
                                labelId="program-select-label"
                                id="program-select"
                                value={selectedProgram ? selectedProgram.userProgramID : ''}
                                onChange={(e) => handleSelectedProgram(parseInt(e.target.value.toString()))}
                            >
                                {userPrograms.map(program => (
                                    <MenuItem key={program.userProgramID} value={program.userProgramID}>
                                        {program.userProgramName}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        {selectedProgram && (
                            <div>
                                <Typography variant="h6" component="div">
                                    Today's Workout:
                                </Typography>
                                {selectedProgram.workouts.map(workout => {
                                    if (workout.workoutPosition === currentDay + 1) {
                                        return (
                                            <div key={workout.workoutID} style={{ marginBottom: "20px" }}>
                                                <Divider style={{ margin: "20px 0" }} />
                                                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                                                    Day {workout.workoutPosition}: {workout.workoutName}
                                                </Typography>
                                                <Typography style={{ color: "#0000008a" }}>
                                                    Targeted Muscle Groups: {workout.targetGroup}
                                                </Typography>
                                                    <div style={{ marginTop: "10px" }}>
                                                    {workout.activities.map(activity => (
                                                        <div key={activity.activityID} style={{ marginBottom: "10px", backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "5px" }}>
                                                            <Typography style={{ textTransform: "capitalize" }}>
                                                                {activity.position}: {activity.exerciseName}
                                                            </Typography>
                                                            <Typography style={{ marginTop: "5px", color: "#0000008a", textTransform: "capitalize" }}>
                                                                Targeted Muscles: {activity.muscleGroup}
                                                            </Typography>
                                                            <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                                                Additional Notes: {activity.notes}
                                                            </Typography>
                                                            <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                                                {activity.reps} Reps | {activity.sets} Sets | RPE {activity.rpe} | Rest Time: {activity.restTime}
                                                            </Typography>
                                                        </div>
                                                    ))}
                                                    </div>
                                            </div>
                                        );
                                    } else {
                                        return null;
                                    }
                                })}
                                {!selectedProgram.workouts.some(workout => workout.workoutPosition === currentDay + 1) && (
                                    <Typography variant="body2" style={{ marginTop: "20px" }}>Rest Day</Typography>
                                )}
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ padding: '0px 10px' }}> {/* Meal Plan Rendering */}
                <Divider style={{ margin: "20px 0" }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <IconButton onClick={handleMealCollapse}>
                        <ArrowDropDownCircleIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Select a Meal Plan:
                    </Typography>
                </div>
                {!isMealsCollapsed && (
                    <div>
                        <FormControl style={{ width: '15%' }}>
                            <InputLabel id="program-select-label">Meal Plan</InputLabel>
                            <Select
                                label="Meal Plan"
                                labelId="program-select-label"
                                id="program-select"
                                value={selectedMealPlan ? selectedMealPlan.mealPlanID : ''}
                                onChange={(e) => handleSelectedPlan(parseInt(e.target.value.toString()))}
                            >
                                {mealPlans.map(plan => (
                                    <MenuItem key={plan.mealPlanID} value={plan.mealPlanID}>
                                        {plan.name}
                                    </MenuItem>
                                ))}
                            </Select>
                        </FormControl>
                        <div>
                            {selectedMealPlan?.dailyMealPlan.map(dailyPlan => (
                            <div key={dailyPlan.dailyMealPlanID} style={{ marginBottom: "20px" }}>
                                <Divider style={{ margin: "20px 0" }} />
                                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                                    Options {dailyPlan.day}
                                </Typography>
                                    <div style={{ marginTop: "10px" }}>
                                    {dailyPlan.meals.map(meal => (
                                        <div key={meal.mealID} style={{ marginBottom: "10px", backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "5px" }}>
                                            <Typography style={{ textTransform: "capitalize" }}>
                                            {meal.mealName} x {meal.servings} Servings
                                            </Typography>
                                            <Typography style={{ marginTop: "5px", color: "#0000008a", textTransform: "capitalize" }}>
                                                Nutrition Per Serving
                                            </Typography>
                                            <Typography style={{ marginTop: "5px", color: "#0000008a", textTransform: "capitalize" }}>
                                                Calories: {meal.calories}
                                            </Typography>
                                            <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                                Fat: {meal.fat}
                                            </Typography>
                                            <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                                Carbohydrate: {meal.carbs}
                                            </Typography>
                                            <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                                Protein: {meal.protein}
                                            </Typography>
                                        </div>
                                    ))}
                                    </div>
                            </div>
                        ))}
                        </div>
                </div>
                )}
            </div>
            <div style={{ padding: '0px 10px' }}> {/* Nutrition Plan Rendering */}
                <Divider style={{ margin: "20px 0" }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <IconButton onClick={handleNutritionCollapse}>
                        <ArrowDropDownCircleIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Your Nutrition Plan:
                    </Typography>
                </div>
                {!isNutritionsCollapsed && (
                    <div> {/* Lazy to add a dropdown menu like Workouts right now, so if there are multiple, only the first nutrition plan retrieved is used. */}
                        {nutritionPlans.length > 0 && (
                            <div key={nutritionPlans[0].nutrition_plan_id} style={{ marginBottom: "10px", backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "5px" }}>
                                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                                Diet Name: {nutritionPlans[0].diet_type}
                                </Typography>
                                <Typography style={{ marginTop: "5px" }}>
                                    Calorie Goal: {nutritionPlans[0].calorie_goal} cal
                                </Typography>
                                <Typography style={{ marginTop: "5px" }}>
                                    Protein Goal: {nutritionPlans[0].protein_goal} g
                                </Typography>
                                <Typography style={{ marginTop: "5px" }}>
                                    Fat Goal: {nutritionPlans[0].fat_goal} g
                                </Typography>
                                <Typography style={{ marginTop: "5px" }}>
                                    Carb Goal: {nutritionPlans[0].carb_goal} g
                                </Typography>
                            </div>
                        )}
                    </div>
                )}
            </div>
            <div style={{ padding: '0px 10px' }}> {/* Supplement Rendering */}
                <Divider style={{ margin: "20px 0" }} />
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
                    <IconButton onClick={handleSupplementCollapse}>
                        <ArrowDropDownCircleIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div">
                        Your Supplements:
                    </Typography>
                </div>
                {!isSupplementsCollapsed && (
                    <div>
                        {supplements.map(supplement => (
                            <div key={supplement.supplementid} style={{ marginBottom: "10px", backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "5px" }}>
                                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                                    {supplement.product_name}
                                </Typography>
                                <Typography style={{ marginTop: "5px" }}>
                                    Link: <a href={supplement.link} target="_blank" rel="noopener noreferrer">{supplement.link}</a>
                                </Typography>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default HomePage;
