import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const SupplementPopup = ({ selectedSupplement, onClose }) => {
    if (!selectedSupplement) return null;

    //const { nutritionPlanName, calorieGoal, proteinGoal, carbGoal, fatGoal} = selectedSupplement;

    return (
        <Dialog open={true} onClose={onClose} sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1000px",
              },
            },
          }}>
            <DialogTitle>{selectedSupplement.diet_type}</DialogTitle>
            <DialogContent >
                <DialogContentText>
                    Calorie Goal : {selectedSupplement.calorie_goal} g
                    <br />
                    Protein Goal: {selectedSupplement.protein_goal} g
                    <br />
                    Fat Goal: {selectedSupplement.fat_goal} g
                    <br />
                    Carb Goal: {selectedSupplement.carb_goal} g
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SupplementPopup;
