import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface SupplementItem {
    supplement_id: number;
    product_name: string;
    product_category: string;
    product_description: string;
    brand_name: string;
    link:string;
    price:number;
    price_per_serving:number;
    overall_rating:number;
    number_of_reviews: number;
    verified_buyer_rating: number;
    verified_buyer_number: number;
    top_flavor_rated: string;
    number_of_flavors: number;
    average_flavor_rating: number;
}

interface Props {
    open: boolean;
    onClose: () => void;
    onSubmit: (supplementItem: SupplementItem) => void;
}

const SupplementForm: React.FC<Props> = ({ open, onClose, onSubmit }) => {
    const [productName, setProductName] = useState("");
    const [productCategory, setProductCategory] = useState("");
    const [description, setDescription] = useState("");
    const [brandName, setBrandName] = useState("");
    const [link, setLink] = useState("");
    const [price, setPrice] = useState("");
    const [pricePerServing, setPricePerServing] = useState("");

    useEffect(() => {
        if (open) {
            setProductName("");
        }
    }, [open]);

    const handleCreatePlanSubmit = () => {
        const supplement: SupplementItem = {
            supplement_id: 0, //TODO: figure out a way for this to not be here
            product_name: productName,
            product_category: productCategory,
            product_description: description,
            brand_name: brandName,
            link: link,
            price: Number(price),
            price_per_serving:Number(pricePerServing),
            overall_rating:0,
            number_of_reviews: 0,
            verified_buyer_rating: 0,
            verified_buyer_number: 0,
            top_flavor_rated: "",
            number_of_flavors: 0,
            average_flavor_rating: 0,
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
            <DialogTitle>Add a Supplement</DialogTitle>
            <DialogContent>
                <div>
                    <label htmlFor="name">Supplement Name:</label>
                    <input
                        type="text"
                        onChange={(e) => setProductName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="category">Category:</label>
                    <input
                        type="text"
                        onChange={(e) => setProductCategory(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="description">Description:</label>
                    <input
                        type="number"
                        onChange={(e) => setDescription(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="brandName">Brand Name:</label>
                    <input
                        type="text"
                        onChange={(e) => setBrandName(e.target.value)}
                    />
                </div>
                <div>
                    <label htmlFor="link">Link:</label>
                    <input
                        type="text"
                        onChange={(e) => setLink(e.target.value)}
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
