import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import { NutritionPlanItem } from "../Interfaces/NutritionPlanItem";

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (nutritionPlanItem: NutritionPlanItem) => void;
    create: boolean;
    //id: number;
    editItem: NutritionPlanItem | null;
}

const NutritionPlanForm: React.FC<Props> = ({ open, onClose, onSubmit, create, editItem}) => {
    const [dietType, setDietType] = useState("");
    const [calorieGoal, setCalorieGoal] = useState(0);
    const [proteinGoal, setProteinGoal] = useState(0);
    const [fatGoal, setFatGoal] = useState(0);
    const [carbGoal, setCarbGoal] = useState(0);
    const [isCreate, setIsCreate] = useState(true);
    //const [addEdit, setAddEdit] = useState("");
    //const [isEdit, setIsEdit] = useState(false);

    useEffect(() => {
        if (open) {
            setIsCreate(create);
            if(create){
                setDietType(""); //TODO: this can be null
            }
            else{
                if(editItem != null){
                    setDietType(editItem.diet_type);
                    setCalorieGoal(editItem.calorie_goal);
                    setProteinGoal(editItem.protein_goal);
                    setFatGoal(editItem.fat_goal);
                    setCarbGoal(editItem.carb_goal);
                }
            };
        }
    }, [open]);

    const handleCreatePlanSubmit = () => {
        
        let id = 0;
        if(editItem != null){
            id = editItem.nutrition_plan_id;
        }
        console.log("id: ", id);
        const nutritionPlan: NutritionPlanItem = {
            nutrition_plan_id: id,
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
            <DialogTitle>Add/Edit a Nutrition Plan</DialogTitle>
            <DialogContent>
                <TextField
                    label="Diet Type"
                    fullWidth
                    value={dietType}
                    onChange={(e) => setDietType(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Calorie Goal"
                    fullWidth
                    value={calorieGoal.toString()}
                    onChange={(e) => setCalorieGoal(Number(e.target.value))}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Protein Goal"
                    fullWidth
                    value={proteinGoal.toString()}
                    onChange={(e) => setProteinGoal(Number(e.target.value))}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Fat Goal"
                    fullWidth
                    value={fatGoal.toString()}
                    onChange={(e) => setFatGoal(Number(e.target.value))}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Carb Goal"
                    fullWidth
                    value={carbGoal.toString()}
                    onChange={(e) => setCarbGoal(Number(e.target.value))}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
            </DialogContent>
            <DialogActions>
                {isCreate ? <Button onClick={handleCreatePlanSubmit}>Create Program</Button> : <Button onClick={handleCreatePlanSubmit}>Edit Program</Button>}
            </DialogActions>
        </Dialog>
    );
};

export default NutritionPlanForm;
