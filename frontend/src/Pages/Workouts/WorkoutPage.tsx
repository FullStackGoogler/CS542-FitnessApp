import React, { useEffect, useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItemButton, Button } from "@mui/material";
import ListItem  from "./Components/WorkoutListItem"
import WorkoutPopup from "./Components/WorkoutPopup"
import WorkoutForm from "./Components/WorkoutForm";

import { Dialog, DialogTitle, DialogContent, DialogActions } from "@mui/material";

const WorkoutPage: React.FC = () => {
    interface WorkoutItem {
        userProgramID: number;
        userProgramName: string;
        userProgramDescription: string;
        userProgramOwner: string;
        daysPerWeek: number;
        image: string;
        workouts: {
            workoutID: number;
            workoutName: string;
            targetGroup: string;
            activities: {
                activityID: number;
                exerciseID: number; //TODO: Needs to grab the exerciseName with the matching exerciseID
                reps: number;
                sets: number;
                rpe: number;
                restTime: number;
            }[];
        }[];
    }

    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
    const [userPrograms, setUserPrograms] = useState<WorkoutItem[]>([]);
    const [createProgram, setCreateProgram] = useState(false);
    
    useEffect(() => {
        fetch('http://localhost:8080/api/userprograms')
            .then(response => response.json())
            .then(data => {
                setUserPrograms(data.map((program: any) => ({
                    userProgramID: program.userprogramid,
                    userProgramName: program.user_program_name,
                    userProgramDescription: program.user_program_desc,
                    userProgramOwner: program.username,
                    daysPerWeek: program.num_days_per_week,
                    image: program.imageURL || `https://via.placeholder.com/150/3A795E/FFFFFF/?text=User+Program`, //TODO: Get better default image URL here
                    workouts: []
                })));
            })
        .catch(error => console.error('Error:', error));

    })

    const handleClick = (item: WorkoutItem) => {
        setSelectedWorkout(item);

        fetch(`http://localhost:8080/api/userprogram/${item.userProgramID}/workouts`)
            .then(response => response.json())
            .then(workoutData => {
                if (Array.isArray(workoutData)) { // Check if workoutData is an array
                    const workoutsMap = new Map<number, any>();
                    workoutData.forEach((workout: any) => {
                        const { workout_id, workout_name, target_group, ...activity } = workout;
                        const activityData = {
                            activityID: activity.activity_id,
                            exerciseID: activity.exercise_name,
                            reps: activity.reps,
                            sets: activity.sets,
                            rpe: activity.rpe,
                            restTime: activity.rest_time
                        };
                        if (workoutsMap.has(workout_id)) {
                            workoutsMap.get(workout_id).activities.push(activityData);
                        } else {
                            workoutsMap.set(workout_id, {
                                workoutID: workout_id,
                                workoutName: workout_name,
                                targetGroup: target_group,
                                activities: [activityData]
                            });
                        }
                    });
                    const workouts = Array.from(workoutsMap.values());
                    setSelectedWorkout(prevSelectedWorkout => ({
                        ...prevSelectedWorkout!,
                        workouts: workouts
                    }));
                }
            })
            .catch(error => console.error('Error fetching workouts:', error));
    };    

    const handleClose = () => {
        setSelectedWorkout(null);
    };

    const handleCreateProgram = () => {
        setCreateProgram(true);
    };

    const handleCreateProgramSubmit = (workoutItem: WorkoutItem) => {
        //TODO: Figure out how to decompoes this interface into SQL queries
        console.log("Workout Item:", workoutItem);
        setCreateProgram(false);
    }

    //TODO: Use CSS to better align these
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
                            <ListItem key={item.userProgramID} workout={item} onClick={() => handleClick(item)} />
                        </ListItemButton>
                    ))}
                </List>
            </div>
            <WorkoutPopup selectedWorkout={selectedWorkout} onClose={handleClose} />

            <WorkoutForm open={createProgram} onClose={handleCreateProgramSubmit}/>
        </div>
    );
}

export default WorkoutPage;
