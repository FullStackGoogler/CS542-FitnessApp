import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Grid, Box, Divider } from "@mui/material";

import DeleteIcon from '@mui/icons-material/Delete';

interface WorkoutItem { //Define interface for a singular complete User Program
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
        workoutPosition: number;
        activities: {
            activityID: number;
            exerciseName: number;
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

interface Exercise {
    exercise_id: number;
    exercise_name: string;
}

interface Props {
    open: boolean;
    onClose: (workoutItem: WorkoutItem) => void;
}

const WorkoutForm: React.FC<Props> = ({ open, onClose }) => {
    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [daysPerWeek, setDaysPerWeek] = useState<number | null>(null);
    const [workouts, setWorkouts] = useState<Array<{ workoutName: string; targetGroup: string; activities: any[] }>>([]);
    const [exercises, setExercises] = useState<Exercise[]>([]);

    useEffect(() => {
        if (open) {
            setProgramName("");
            setProgramDescription("");
            setImageURL("");
            setDaysPerWeek(null);
            setWorkouts([]);
            fetchExercises();
        }
    }, [open]);

    const fetchExercises = async () => {
        try {
            const response = await fetch("http://localhost:8080/api/exercises");
            const data = await response.json();
            setExercises(data);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    const handleProgramSubmit = () => {
        const workoutItem: WorkoutItem = {
            userProgramID: 100, //TODO: Figure out how to create a unique ID
            userProgramName: programName,
            userProgramDescription: programDescription,
            userProgramOwner: 'AutoNerd', //TODO: Set to be currentUser.username somehow
            daysPerWeek: daysPerWeek!,
            image: imageURL,
            workouts: workouts.map((workout, index) => ({
                workoutID: index, //TODO: Figure out how to create a unique ID
                workoutName: workout.workoutName,
                targetGroup: workout.targetGroup,
                workoutPosition: index, //TODO: Check that this is correct
                activities: workout.activities.map(activity => ({
                    ...activity,
                    exerciseID: parseInt(activity.exerciseID)
                }))
            }))
        };

        onClose(workoutItem);
    };

    const handleWorkoutNameChange = (index: number, value: string) => {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[index].workoutName = value;
        setWorkouts(updatedWorkouts);
    };

    const handleTargetGroupChange = (index: number, value: string) => {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[index].targetGroup = value;
        setWorkouts(updatedWorkouts);
    };

    const handleAddExercise = (index: number) => {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[index].activities.push({
            activityID: updatedWorkouts[index].activities.length,
            exerciseID: "",
            reps: 0,
            sets: 0,
            rpe: 0,
            restTime: 0
        });
        setWorkouts(updatedWorkouts);
    };

    const handleDeleteExercise = (workoutIndex: number, activityIndex: number) => {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[workoutIndex].activities.splice(activityIndex, 1);
        setWorkouts(updatedWorkouts);
    };

    const handleDaysPerWeekChange = (value: number) => {
        setDaysPerWeek(value);
        setWorkouts([...Array(value)].map(() => ({
            workoutName: "",
            targetGroup: "",
            activities: []
        })));
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md">
            <DialogTitle>Add a Program</DialogTitle>
            <DialogContent>
                <TextField
                    label="Program Name"
                    fullWidth
                    value={programName}
                    onChange={(e) => setProgramName(e.target.value)}
                    style={{ marginBottom: '1em' }}
                />
                <TextField
                    label="Program Description"
                    fullWidth
                    multiline
                    rows={4}
                    value={programDescription}
                    onChange={(e) => setProgramDescription(e.target.value)}
                    style={{ marginBottom: '1em' }}
                />
                <TextField
                    label="Image URL"
                    fullWidth
                    value={imageURL}
                    onChange={(e) => setImageURL(e.target.value)}
                    style={{ marginBottom: '1em' }}
                />
                <Box sx={{ minWidth: 120 }}>
                    <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">Days per Week</InputLabel>
                        <Select
                            labelId="demo-simple-select-label"
                            id="demo-simple-select"
                            value={daysPerWeek ?? ''}
                            label="Age"
                        >
                        {[...Array(7)].map((_, index) => (
                            <MenuItem key={index} value={index + 1}>
                                {index + 1}
                            </MenuItem>
                        ))}
                        </Select>
                    </FormControl>
                </Box>
                <Box mt={2}>
                    <FormControl fullWidth>
                        <InputLabel id="daysPerWeek-label">Days per Week</InputLabel>
                        <Select
                            labelId="daysPerWeek-label"
                            id="daysPerWeek"
                            value={daysPerWeek ?? ''}
                            onChange={(e) => handleDaysPerWeekChange(parseInt(e.target.value.toString()))}
                        >
                            {[...Array(7)].map((_, index) => (
                                <MenuItem key={index} value={index + 1}>
                                    {index + 1}
                                </MenuItem>
                            ))}
                        </Select>
                    </FormControl>
                </Box>
                {daysPerWeek && (
                    <>
                        {workouts.map((workout, index) => (
                            <div key={index}>
                                <Divider style={{ margin: '20px 0' }} />
                                <Box
                                    component="form"
                                    sx={{
                                        '& .MuiTextField-root': { m: 1, width: '25ch' },
                                    }}
                                    noValidate
                                    autoComplete="off"
                                >
                                    <TextField
                                        label={`Workout Name for Day ${index + 1}`}
                                        fullWidth
                                        value={workout.workoutName}
                                        onChange={(e) => handleWorkoutNameChange(index, e.target.value)}
                                    />
                                    <TextField
                                        label={`Target Group for Day ${index + 1}`}
                                        fullWidth
                                        value={workout.targetGroup}
                                        onChange={(e) => handleTargetGroupChange(index, e.target.value)}
                                    />
                                </Box>

                                <Button onClick={() => handleAddExercise(index)}>Add Exercise</Button>
                                {workout.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex}>
                                        <Divider style={{ margin: '10px 0' }} />
                                        <FormControl fullWidth>
                                            <InputLabel>Exercise</InputLabel>
                                            <Select
                                                value={activity.exerciseID}
                                                onChange={(e) => {
                                                    const updatedWorkouts = [...workouts];
                                                    updatedWorkouts[index].activities[activityIndex].exerciseID = e.target.value as number;
                                                    setWorkouts(updatedWorkouts);
                                                }}
                                            >
                                                {exercises.map((exercise) => (
                                                    <MenuItem
                                                        key={exercise.exercise_id}
                                                        value={exercise.exercise_id}
                                                    >
                                                        {exercise.exercise_name}
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>
                                        <Box
                                            component="form"
                                            sx={{
                                                '& .MuiTextField-root': { m: 1, width: '25ch' },
                                            }}
                                            noValidate
                                            autoComplete="off"
                                        >
                                            <TextField
                                            label="Reps"
                                            type="number"
                                            value={activity.reps}
                                            onChange={(e) => {
                                                const updatedWorkouts = [...workouts];
                                                updatedWorkouts[index].activities[activityIndex].reps = parseInt(e.target.value);
                                                setWorkouts(updatedWorkouts);
                                            }}
                                            />
                                            <TextField
                                                label="Sets"
                                                type="number"
                                                value={activity.sets}
                                                onChange={(e) => {
                                                    const updatedWorkouts = [...workouts];
                                                    updatedWorkouts[index].activities[activityIndex].sets = parseInt(e.target.value);
                                                    setWorkouts(updatedWorkouts);
                                                }}
                                            />
                                            <TextField
                                                label="RPE"
                                                type="number"
                                                value={activity.rpe}
                                                onChange={(e) => {
                                                    const updatedWorkouts = [...workouts];
                                                    updatedWorkouts[index].activities[activityIndex].rpe = parseInt(e.target.value);
                                                    setWorkouts(updatedWorkouts);
                                                }}
                                            />
                                            <TextField
                                                label="Rest Time"
                                                type="number"
                                                value={activity.restTime}
                                                onChange={(e) => {
                                                    const updatedWorkouts = [...workouts];
                                                    updatedWorkouts[index].activities[activityIndex].restTime = parseInt(e.target.value);
                                                    setWorkouts(updatedWorkouts);
                                                }}
                                            />
                                            <IconButton aria-label="delete" onClick={() => handleDeleteExercise(index, activityIndex)}>
                                                <DeleteIcon />
                                            </IconButton>
                                        </Box>
                                        
                                    </div>
                                ))}
                            </div>
                        ))}
                    </>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleProgramSubmit}>Create Program</Button>
            </DialogActions>
        </Dialog>
    );    
};

export default WorkoutForm;
