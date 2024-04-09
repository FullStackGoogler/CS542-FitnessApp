import React, { useEffect, useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItemButton, Button } from "@mui/material";
import ListItem  from "./Components/WorkoutListItem"
import WorkoutPopup from "./Components/WorkoutPopup"
import WorkoutForm from "./Components/WorkoutForm";

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const WorkoutPage: React.FC = () => {
    interface WorkoutItem { //Define interface for a singular complete User Program
        userProgramID: number;
        userProgramName: string;
        userProgramDescription: string;
        userProgramOwner: number;
        daysPerWeek: number;
        image: string;
        workouts: {
            workoutID: number;
            workoutName: string;
            targetGroup: string;
            workoutPosition: number;
            activities: {
                activityID: number;
                exerciseID: number;
                muscleGroup: string;
                reps: string;
                sets: number;
                rpe: number;
                restTime: string;
                notes: string;
                position: number;
            }[];
        }[];
    }

    const [selectedProgram, setSelectedProgram] = useState<WorkoutItem | null>(null);
    const [userPrograms, setUserPrograms] = useState<WorkoutItem[]>([]);
    const [createProgram, setCreateProgram] = useState(false);
    
    //Fetch all User Programs on page load
    useEffect(() => {
        fetch('http://localhost:9000/api/userprograms')
            .then(response => response.json())
            .then(data => {
                setUserPrograms(data.map((program: any) => ({
                    userProgramID: program.userprogramid,
                    userProgramName: program.user_program_name,
                    userProgramDescription: program.user_program_desc,
                    userProgramOwner: program.username,
                    daysPerWeek: program.num_days_per_week,
                    image: program.imageURL || `https://via.placeholder.com/150/3A795E/FFFFFF/?text=User+Program`,
                    workouts: []
                })));
            })
        .catch(error => console.error('Error:', error));
    })

    //Load a complete User Program
    const handlePopupOpen = (item: WorkoutItem) => {
        setSelectedProgram(item);

        fetch(`http://localhost:9000/api/userprogram/${item.userProgramID}/workouts`)
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
            <TopBar title="Workouts" titleColor="#ffffff"/>
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

export default WorkoutPage;
