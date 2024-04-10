import React, { useEffect, useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItemButton, Button } from "@mui/material";

const MealPage: React.FC = () => {
    interface MealPlanItem { //Define interface for a singular complete User Program
        mealPlanID: number;
        owner: string;
        description: string;
        dailyMealPlan: {
            dailyMealPlanID: number;
            day: string;
            meal: {
                mealID: number;
                mealName: string;
                cookTime: string;
                prepTime: string;
                description: string;
                receipeingredientquantity: string;
                recipeingredientparts: string;
                calories: number;
                fat: number;
                carbs: number;
                protein: number;
                otherNutritions:{
                    saturatedFat: number;
                    cholesterol:number;
                    sodium: number;
                    fiber: number;
                    sugar: number;
                }
                recipeServings: number;
                recipeYield: string;
                recipeInstructions: string;
            }[];
        }[];
    }

    const [selectedProgram, setSelectedProgram] = useState<MealPlanItem | null>(null);
    const [userPrograms, setMealPlans] = useState<MealPlanItem[]>([]);
    const [createProgram, setCreateProgram] = useState(false);
    
    //Fetch all User Programs on page load
    useEffect(() => {
        fetch('http://localhost:9000/api/mealplan')
            .then(response => response.json())
            .then(data => {
                setMealPlans(data.map((plan: any) => ({
                    mealPlanID: plan.meal_plan_id,
                    owner: plan.owner,
                    description: plan.description,
                    dailyMealPlan: []
                })));
            })
        .catch(error => console.error('Error:', error));
    })

    //Load a complete User Program
    const handlePopupOpen = (item: MealPlanItem) => {
        setSelectedProgram(item);

        fetch(`http://localhost:9000/api/userprogram/${item.mealPlanID}/workouts`)
            .then(response => response.json())
            .then(workoutData => {
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
                setSelectedProgram(prevSelectedWorkout => ({
                    ...prevSelectedWorkout!,
                    workouts: workouts
                })); 
            })
    };    

    const handlePopupClose = () => {
        setSelectedProgram(null);
    };

    const handleCreateProgram = () => {
        setCreateProgram(true);
    };

    const handleCreateProgramSubmit = async (workoutItem: WorkoutItem) => {
        //console.log("Workout Item:", workoutItem); //TODO: Debugging purposes
        //console.log("Workout Stringed:", JSON.stringify(workoutItem)) //TODO: Debugging purposes
        setCreateProgram(false);

        try {
            const response = await fetch('http://localhost:9000/api/workoutItem', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(workoutItem)
            });

            if (response.ok) {
                const responseData = await response.json();
                console.log('WorkoutItem successfully sent:', responseData);
            } else {
                console.error('Failed to send WorkoutItem:', response.statusText);
            }
        } catch (error: any) {
            console.error('Error sending WorkoutItem:', error.message);
        }
    };

    return (
        <div>
            <TopBar title="Meal Plans" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>List of User Programs</div>
                <Button variant="contained" color="primary" onClick={handleCreateProgram}>Add a Program</Button>
            </div>
            <div style={{ position: 'absolute', top: '125px', bottom: '0', width: '100%' }}>
                <List>
                    {userPrograms.map(item => (
                        <ListItemButton>
                            <ListItem key={item.userProgramID} workout={item} onClick={() => handlePopupOpen(item)} />
                        </ListItemButton>
                    ))}
                </List>
            </div>
            <WorkoutPopup selectedWorkout={selectedProgram} onClose={handlePopupClose} />

            <WorkoutForm open={createProgram} onClose={handleCreateProgramSubmit}/>
        </div>
    );
}

export default MealPage;