import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Divider} from "@mui/material";

const NutritionPlanPopup = ({ selectedNutritionPlan, onClose }) => {
    if (!selectedNutritionPlan) return null;

    //const { nutritionPlanName, calorieGoal, proteinGoal, carbGoal, fatGoal} = selectedNutritionPlan;

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>{selectedNutritionPlan.diet_type}</DialogTitle>
            <DialogContent >
                <Divider style={{ margin: "20px 0" }} />
                <DialogContentText style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                    Calorie Goal : {selectedNutritionPlan.calorie_goal} Calories
                </DialogContentText>
                <Divider style={{ margin: "20px 0" }} />
                <DialogContentText style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                    Protein Goal: {selectedNutritionPlan.protein_goal} g
                </DialogContentText>
                <Divider style={{ margin: "20px 0" }} />
                <DialogContentText style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                    Fat Goal: {selectedNutritionPlan.fat_goal} g
                </DialogContentText>
                <Divider style={{ margin: "20px 0" }} />
                <DialogContentText style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                    Carb Goal: {selectedNutritionPlan.carb_goal} g
                </DialogContentText>
                <Divider style={{ margin: "20px 0" }} />
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NutritionPlanPopup;
