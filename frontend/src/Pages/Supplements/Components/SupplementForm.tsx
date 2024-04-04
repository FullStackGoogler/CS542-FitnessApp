import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface SupplementItem {
    supplement_id: number;
    name: string;
    quantity: number;
    protein: number;
    fat: number;
    carb: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (supplementItem: SupplementItem) => void;
}

const SupplementForm: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [name, setName] = useState("");
    const [quantity, setQuantity] = useState("");
    const [protein, setProtein] = useState("");
    const [fat, setFat] = useState("");
    const [carb, setCarb] = useState("");

    useEffect(() => {
        if (open) {
            setName("");
        }
    }, [open]);

    const handleCreatePlanSubmit = () => {
        const supplement: SupplementItem = {
            supplement_id: 0, //TODO: figure out a way for this to not be here
            name: name,
            quantity: Number(quantity),
            protein: Number(protein),
            fat: Number(fat),
            carb: Number(carb)
        };

        console.log(supplement);

        onSubmit(supplement);
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
                    <label htmlFor="name">Diet Type:</label>
                    <input
                        type="text"
                        onChange={(e) => setName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="quantity">Calorie Goal:</label>
                    <input
                        type="text"
                        onChange={(e) => setQuantity(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="protein">Protein Goal:</label>
                    <input
                        type="number"
                        onChange={(e) => setProtein(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="fat">Fat Goal:</label>
                    <input
                        type="text"
                        onChange={(e) => setFat(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="carb">Fat Goal:</label>
                    <input
                        type="text"
                        onChange={(e) => setCarb(e.target.value)}
                    />
                </div>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreatePlanSubmit}>Create Program</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SupplementForm;
