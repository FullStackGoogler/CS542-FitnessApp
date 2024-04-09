import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Grid, Box, Divider } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';

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
            const response = await fetch("http://localhost:9000/api/exercises");
            const data = await response.json();
            setExercises(data);
        } catch (error) {
            console.error("Error fetching exercises:", error);
        }
    };

    const handleProgramSubmit = () => {
        const workoutItem: WorkoutItem = {
            userProgramID: -1, //TODO: Figure out how to create a unique ID
            userProgramName: programName,
            userProgramDescription: programDescription,
            userProgramOwner: 1, //TODO: Set to be currentUser.username somehow
            daysPerWeek: daysPerWeek!,
            image: imageURL,
            workouts: workouts.map((workout, index) => ({
                workoutID: index + 1, //TODO: Figure out how to create a unique ID
                workoutName: workout.workoutName,
                targetGroup: workout.targetGroup,
                workoutPosition: index,
                activities: workout.activities.map(activity => ({
                    ...activity,
                    exerciseID: parseInt(activity.exerciseID)
                }))
            }))
        };

        onClose(workoutItem);
    };

    const handleAddExercise = (index: number) => {
        const updatedWorkouts = [...workouts];
        const newActivityPosition = updatedWorkouts[index].activities.length + 1;
        updatedWorkouts[index].activities.push({
            activityID: updatedWorkouts[index].activities.length,
            exerciseID: "",
            reps: 0,
            sets: 0,
            rpe: 0,
            restTime: 0,
            position: newActivityPosition
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
        const newWorkouts = [...Array(value)].map((_, index) => ({
            workoutName: "",
            targetGroup: "",
            workoutPosition: index + 1,
            activities: []
        }));
        setWorkouts(newWorkouts);
    };

    //Helper function to make the list of Exercises look prettier
    const capitalize = (str: string) => {
        return str.replace(/\b\w/g, (char) => char.toUpperCase());
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
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
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
                <FormControl fullWidth>
                    <InputLabel id="daysPerWeek-label">Days per Week</InputLabel>
                    <Select
                        label="Days per Week"
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
                {daysPerWeek && (
                    <>
                        {workouts.map((workout, index) => (
                            <div key={index}>
                                <Divider style={{ margin: '20px 0' }} />
                                <TextField
                                    label={`Workout Name for Day ${index + 1}`}
                                    fullWidth
                                    value={workout.workoutName}
                                    onChange={(e) => {
                                        const updatedWorkouts = [...workouts];
                                        updatedWorkouts[index].workoutName = e.target.value;
                                        setWorkouts(updatedWorkouts);
                                    }}
                                    style={{ marginBottom: '1em' }}
                                />
                                <TextField
                                    label={`Target Group for Day ${index + 1}`}
                                    fullWidth
                                    value={workout.targetGroup}
                                    onChange={(e) => {
                                        const updatedWorkouts = [...workouts];
                                        updatedWorkouts[index].targetGroup = e.target.value;
                                        setWorkouts(updatedWorkouts);
                                    }}
                                    style={{ marginBottom: '1em' }}
                                />
                                <Button onClick={() => handleAddExercise(index)}>Add Exercise</Button>
                                {workout.activities.map((activity, activityIndex) => (
                                    <div key={activityIndex}>
                                        <Divider style={{ margin: '10px 0' }} />
                                        <Autocomplete
                                            disablePortal
                                            autoHighlight
                                            id="exercise-selection"
                                            options={exercises}
                                            getOptionLabel={(exercise) => capitalize(exercise.exercise_name)}
                                            onChange={(e, newValue) => {
                                                console.log(newValue)
                                                const updatedWorkouts = [...workouts];
                                                updatedWorkouts[index].activities[activityIndex].exerciseID = newValue ? newValue.exercise_id : null;
                                                console.log(updatedWorkouts[index].activities[activityIndex])
                                                setWorkouts(updatedWorkouts);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="Exercises" />}
                                            style={{ marginBottom: '1em' }}
                                        />
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Reps"
                                                    type="number"
                                                    value={activity.reps}
                                                    onChange={(e) => {
                                                        const updatedWorkouts = [...workouts];
                                                        updatedWorkouts[index].activities[activityIndex].reps = parseInt(e.target.value);
                                                        setWorkouts(updatedWorkouts);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Sets"
                                                    type="number"
                                                    value={activity.sets}
                                                    onChange={(e) => {
                                                        const updatedWorkouts = [...workouts];
                                                        updatedWorkouts[index].activities[activityIndex].sets = parseInt(e.target.value);
                                                        setWorkouts(updatedWorkouts);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="RPE"
                                                    type="number"
                                                    value={activity.rpe}
                                                    onChange={(e) => {
                                                        const updatedWorkouts = [...workouts];
                                                        updatedWorkouts[index].activities[activityIndex].rpe = parseInt(e.target.value);
                                                        setWorkouts(updatedWorkouts);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Rest Time"
                                                    value={activity.restTime}
                                                    onChange={(e) => {
                                                        const updatedWorkouts = [...workouts];
                                                        updatedWorkouts[index].activities[activityIndex].restTime = e.target.value;
                                                        setWorkouts(updatedWorkouts);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <IconButton aria-label="delete" onClick={() => handleDeleteExercise(index, activityIndex)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
                                        <TextField
                                            label="Notes"
                                            fullWidth
                                            value={activity.notes}
                                            onChange={(e) => {
                                                const updatedWorkouts = [...workouts];
                                                updatedWorkouts[index].activities[activityIndex].notes = e.target.value;
                                                setWorkouts(updatedWorkouts);
                                            }}
                                        />
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
