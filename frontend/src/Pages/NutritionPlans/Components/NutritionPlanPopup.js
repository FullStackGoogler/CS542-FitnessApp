import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const NutritionPlanPopup = ({ selectedNutritionPlan, onClose }) => {
    if (!selectedNutritionPlan) return null;

    //const { nutritionPlanName, calorieGoal, proteinGoal, carbGoal, fatGoal} = selectedNutritionPlan;

    return (
        <Dialog open={true} onClose={onClose} sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1000px",
              },
            },
          }}>
            <DialogTitle>{selectedNutritionPlan.diet_type}</DialogTitle>
            <DialogContent >
                <DialogContentText>
                    Calorie Goal : {selectedNutritionPlan.calorie_goal} g
                    <br />
                    Protein Goal: {selectedNutritionPlan.protein_goal} g
                    <br />
                    Fat Goal: {selectedNutritionPlan.fat_goal} g
                    <br />
                    Carb Goal: {selectedNutritionPlan.carb_goal} g
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default NutritionPlanPopup;
