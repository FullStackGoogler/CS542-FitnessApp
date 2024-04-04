import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface NutritionPlanItem {
    nutrition_plan_id: number;
    calorie_goal: number;
    diet_type: string;
    protein_goal: number;
    fat_goal: number;
    carb_goal: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (nutritionPlanItem: NutritionPlanItem) => void;
}

const NutritionPlanForm: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [dietType, setDietType] = useState("");
    const [calorieGoal, setCalorieGoal] = useState("");
    const [proteinGoal, setProteinGoal] = useState("");
    const [fatGoal, setFatGoal] = useState("");
    const [carbGoal, setCarbGoal] = useState("");

    useEffect(() => {
        if (open) {
            setDietType("");
        }
    }, [open]);

    const handleCreatePlanSubmit = () => {
        const nutritionPlan: NutritionPlanItem = {
            nutrition_plan_id: 0,//TODO: some way to get this not here
            calorie_goal: Number(calorieGoal),
            diet_type: dietType,
            protein_goal: Number(proteinGoal),
            fat_goal: Number(fatGoal),
            carb_goal: Number(carbGoal)
        };

        console.log(nutritionPlan);

        onSubmit(nutritionPlan);
        onClose();
    };

   /* const handleCalorieGoalChange = (index: number, value: number) => {
        const updatedCalorieGoal = value;
        setCalorieGoal(updatedCalorieGoal);
    };

    const handleProteinGoalChange = (index: number, value: string) => {
        const updatedWorkouts = [...workouts];
        updatedWorkouts[index].targetGroup = value;
        setWorkouts(updatedWorkouts);
    };

    const handleFatGoalChange = (index: number, value: string) => {
       
    };

    const handleCarbGoalChange = (index: number, value: string) => {
       
    };*/

    return (
        <Dialog open={open} onClose={onClose} sx={{
            "& .MuiDialog-container": {
                "& .MuiPaper-root": {
                    width: "100%",
                    maxWidth: "600px",
                },
            },
        }}>
            <DialogTitle>Add a Nutrition Plan</DialogTitle>
            <DialogContent>
                <div>
                    <label htmlFor="diet_type">Diet Type:</label>
                    <input
                        type="text"
                        onChange={(e) => setDietType(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="calorie_goal">Calorie Goal:</label>
                    <input
                        type="text"
                        onChange={(e) => setCalorieGoal(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="protein_goal">Protein Goal:</label>
                    <input
                        type="number"
                        onChange={(e) => setProteinGoal(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fat_goal">Fat Goal:</label>
                    <input
                        type="text"
                        onChange={(e) => setFatGoal(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="carb_goal">Carb Goal:</label>
                    <input
                        type="text"
                        onChange={(e) => setCarbGoal(e.target.value)}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreatePlanSubmit}>Create Program</Button>
            </DialogActions>
        </Dialog>
    );
};

export default NutritionPlanForm;
