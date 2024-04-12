import React, { useState, useEffect } from "react";
import TopBar from "../../Components/TopBar";
import { FormControl, InputLabel, Select, MenuItem, Typography, Divider } from "@mui/material";

import { WorkoutItem } from "../Workouts/Interfaces/WorkoutItem";

const HomePage = () => {
    const [userPrograms, setUserPrograms] = useState<WorkoutItem[]>([]);
    const [selectedProgram, setSelectedProgram] = useState<WorkoutItem | null>(null);
    const [currentDay, setCurrentDay] = useState<number>(0);
    const currentDate = new Date();

    const formattedDate = currentDate.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });

    //Fetch all User Programs on page load that the current user has favorited
    useEffect(() => {
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
    
        //Determine the current day
        const today = new Date().getDay();
        setCurrentDay(today);
    }, []);
    

    const handleSelectedProgram = (userProgramID: number) => {
        fetch(`http://localhost:9000/api/userprogram/${userProgramID}/workouts`)
            .then(response => response.json())
            .then(workoutData => {
                console.log(workoutData);
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
                console.log(selectedProgramItem)
    
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
    
    //TODO: Debugging useEffect for checking that selectedProgram contains the complete data
    useEffect(() => {
        console.log(selectedProgram);
    }, [selectedProgram]);

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
                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h6" component="div">
                    Select a User Program:
                </Typography>
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
            </div>
            <div>
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
        </div>
    );
}

export default HomePage;
