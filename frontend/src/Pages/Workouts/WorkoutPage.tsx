import React, { useEffect, useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItemButton, Button } from "@mui/material";
import ListItem  from "./Components/WorkoutListItem"
import WorkoutPopup from "./Components/WorkoutPopup"

const WorkoutPage: React.FC = () => {
    interface WorkoutItem {
        userProgramID: number;
        userProgramName: string;
        userProgramDescription: string;
        daysPerWeek: number;
        image: string;
        workouts: {
            workoutID: number;
            workoutName: string;
            targetGroup: string;
            activities: {
                activityID: number;
                exerciseID: string; //TODO: Needs to grab the exerciseName with the matching exerciseID
                reps: number;
                sets: number;
                rpe: number;
                restTime: number;
            }[];
        }[];
    }

    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null);
    const [userPrograms, setUserPrograms] = useState<WorkoutItem[]>([]);
/*
    fetch('http://localhost:8080/api/exercises')
        .then(response => response.json())
        .then(data => {
            console.log('Exercises:', data);
        })
        .catch(error => console.error('Error:', error));
*/
    
    useEffect(() => {
        fetch('http://localhost:8080/api/userprograms')
            .then(response => response.json())
            .then(data => {
                setUserPrograms(data.map((program: any) => ({
                    userProgramID: program.userprogramid,
                    userProgramName: program.user_program_name,
                    userProgramDescription: program.user_program_desc,
                    daysPerWeek: program.num_days_per_week,
                    image: program.imageURL || `https://via.placeholder.com/150/3A795E/FFFFFF/?text=User+Program`, //TODO: Get better default image URL here
                    workouts: []
                })));
            })
        .catch(error => console.error('Error:', error));

    })

    //Chat GPT generated dummy data; replace with actual DB data
    const dummyItems = Array.from({ length: 30 }, (_, index) => ({
        userProgramID: index + 1,
        userProgramName: `User Program ${index + 1}`,
        userProgramDescription: `Description for Program ${index + 1}`,
        daysPerWeek: 5,
        image: `https://via.placeholder.com/150/FF5733/FFFFFF/?text=Workout+${index + 1}`,
        workouts: Array.from({ length: 3 }, (_, i) => ({
            workoutID: i + 1,
            workoutName: `Workout ${i + 1}`,
            targetGroup: "Muscles",
            activities: Array.from({ length: 3 }, (_, j) => ({
                activityID: j + 1,
                exerciseID: `Activity ${j + 1}`,
                reps: 8,
                sets: 5,
                rpe: 5,
                restTime: 2
            }))
        }))
    }));

    const handleClick = (item: WorkoutItem) => {
        setSelectedWorkout(item);
        console.log(item.userProgramID);
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
                } else {
                    console.error('Workouts data is not an array:', workoutData);
                }
            })
            .catch(error => console.error('Error fetching workouts:', error));
    };    

    const handleClose = () => {
        setSelectedWorkout(null);
    };
    //TODO: Use CSS to better align these
    return (
        <div>
            <TopBar title="Workouts" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>List of User Programs</div>
                <Button variant="contained" color="primary">Add a Program</Button>
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
        </div>
    );
}

export default WorkoutPage;
