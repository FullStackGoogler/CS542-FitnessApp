import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton, Typography, Grid, Box, Divider } from "@mui/material";
import Autocomplete from '@mui/material/Autocomplete';
import DeleteIcon from '@mui/icons-material/Delete';

import { MealPlanItem } from "../Interfaces/MealPlanItem";
import { Meal } from "../Interfaces/Meal";

interface Props {
    open: boolean;
    onClose: (mealPlanItem: MealPlanItem) => void;
}

const WorkoutForm: React.FC<Props> = ({ open, onClose }) => {
    const [programName, setProgramName] = useState("");
    const [programDescription, setProgramDescription] = useState("");
    const [imageURL, setImageURL] = useState("");
    const [numberOfOptions, setOptions] = useState<number | null>(null);
    const [dailyMealPlans, setDailies] = useState<Array<{ day: number;  meals: any[]}>>([]);
    const [meals, setmeals] = useState<Meal[]>([]);

    useEffect(() => {
        if (open) {
            setProgramName("");
            setProgramDescription("");
            setImageURL("");
            setOptions(null);
            setDailies([]);
            fetchmeals();
        }
    }, [open]);

    const fetchmeals = async () => {
        try {
            const response = await fetch("http://localhost:9000/api/meal");
            const data = await response.json();
            setmeals(data);
        } catch (error) {
            console.error("Error fetching meal:", error);
        }
    };

    const handleProgramSubmit = () => {
        const mealPlanItem: MealPlanItem = {
            mealPlanID: -1,
            name: programName,
            description: programDescription,
            owner: "1", //TODO: Set to be currentUser.username somehow
            dailyMealPlan: dailyMealPlans.map((meal, index) => ({
                dailyMealPlanID: index +1,
                day: meal.day,
                meals: meal.meals.map(meal => ({
                    ...meal,
                    meal: parseInt(meal.mealid)
                }))
            }))
        };
        console.log(mealPlanItem)
        onClose(mealPlanItem);

    };

    const handleAddExercise = (index: number) => {
        const updatedDailies = [...dailyMealPlans];
        updatedDailies[index].meals.push({
            dailyMealID: updatedDailies[index].meals.length,
            mealID: "",
            servings: 0,
        });
        setDailies(updatedDailies);
    };

    const handleDeleteExercise = (workoutIndex: number, activityIndex: number) => {
        const updatedDailies = [...dailyMealPlans];
        updatedDailies[workoutIndex].meals.splice(activityIndex, 1);
        setDailies(updatedDailies);
    };

    const handleDaysPerWeekChange = (value: number) => {
        setOptions(value);
        const newWorkouts = [...Array(value)].map((_, index) => ({
            day: index + 1,
            meals: []
        }));
        setDailies(newWorkouts);
    };

    //Helper function to make the list of meals look prettier
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
                <FormControl fullWidth>
                    <InputLabel id="numberOfOptions-label">Days per Week</InputLabel>
                    <Select
                        label="Days per Week"
                        labelId="numberOfOptions-label"
                        id="numberOfOptions"
                        value={numberOfOptions ?? ''}
                        onChange={(e) => handleDaysPerWeekChange(parseInt(e.target.value.toString()))}
                    >
                        {[...Array(7)].map((_, index) => (
                            <MenuItem key={index} value={index + 1}>
                                {index + 1}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {numberOfOptions && (
                    <>
                        {dailyMealPlans.map((meal, index) => (
                            <div key={index}>
                                <Divider style={{ margin: '20px 0' }} />
                                <DialogTitle>Option {index+1}</DialogTitle>
                                <Button onClick={() => handleAddExercise(index)}>Add Meal</Button>
                                {meal.meals.map((activity, activityIndex) => (
                                    <div key={activityIndex}>
                                        <Divider style={{ margin: '10px 0' }} />
                                        <Autocomplete
                                            disablePortal
                                            autoHighlight
                                            id="meal-selection"
                                            options={meals}
                                            getOptionLabel={(meal) => capitalize(meal.mealname)}
                                            onChange={(e, newValue) => {
                                                console.log(newValue)
                                                const updatedDailies = [...dailyMealPlans];
                                                updatedDailies[index].meals[activityIndex].mealID = newValue ? newValue.mealid : null;
                                                console.log(updatedDailies[index].meals[activityIndex])
                                                setDailies(updatedDailies);
                                            }}
                                            renderInput={(params) => <TextField {...params} label="meals" />}
                                            style={{ marginBottom: '1em' }}
                                        />
                                        <Grid container spacing={1}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    fullWidth
                                                    label="Servings"
                                                    type="number"
                                                    value={activity.servings}
                                                    onChange={(e) => {
                                                        const updatedDailies = [...dailyMealPlans];
                                                        updatedDailies[index].meals[activityIndex].servings = parseInt(e.target.value);
                                                        console.log(updatedDailies[index].meals[activityIndex])
                                                        setDailies(updatedDailies);
                                                    }}
                                                />
                                            </Grid>
                                            <Grid item xs={12}>
                                                <IconButton aria-label="delete" onClick={() => handleDeleteExercise(index, activityIndex)}>
                                                    <DeleteIcon/>
                                                </IconButton>
                                            </Grid>
                                        </Grid>
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
