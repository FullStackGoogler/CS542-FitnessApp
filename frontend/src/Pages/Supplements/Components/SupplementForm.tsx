import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField, Select, MenuItem, FormControl, InputLabel, IconButton } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';

interface SupplementItem {
    supplementid: number;
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
    const [overallRating, setOverallRating] = useState("");
    const [numberOfReviews, setNumberOfReviews] = useState("");
    const [verifiedBuyerRating, setVerifiedBuyerRating] = useState("");
    const [verifiedBuyerNumber, setVerifiedBuyerNumber] = useState("");
    const [topFlavorRated, setTopFlavorRated] = useState("");
    const [numberOfFlavors, setNumberOfFlavors] = useState("");
    const [averageFlavorRating, setAverageFlavorRating] = useState("");

    useEffect(() => {
        if (open) {
            setProductName("");
        }
    }, [open]);

    const handleCreatePlanSubmit = () => {
        const supplement: SupplementItem = {
            supplementid: 0, //TODO: figure out a way for this to not be here
            product_name: productName,
            product_category: productCategory,
            product_description: description,
            brand_name: brandName,
            link: link,
            price: Number(price),
            price_per_serving:Number(pricePerServing),
            overall_rating: Number(overallRating),
            number_of_reviews: Number(numberOfReviews),
            verified_buyer_rating: Number(verifiedBuyerRating),
            verified_buyer_number: Number(verifiedBuyerNumber),
            top_flavor_rated: topFlavorRated,
            number_of_flavors: Number(numberOfFlavors),
            average_flavor_rating: Number(averageFlavorRating),
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
                <TextField
                    label="Supplement Name"
                    fullWidth
                    value={productName}
                    onChange={(e) => setProductName(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Category"
                    fullWidth
                    value={productCategory}
                    onChange={(e) => setProductCategory(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Description"
                    fullWidth
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Brand name"
                    fullWidth
                    value={brandName}
                    onChange={(e) => setBrandName(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Link"
                    fullWidth
                    value={link}
                    onChange={(e) => setLink(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Price"
                    fullWidth
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Price"
                    fullWidth
                    value={pricePerServing}
                    onChange={(e) => setPricePerServing(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Overall Rating"
                    fullWidth
                    value={overallRating}
                    onChange={(e) => setOverallRating(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Number of Reviews"
                    fullWidth
                    value={numberOfReviews}
                    onChange={(e) => setNumberOfReviews(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Verified Buyer Rating"
                    fullWidth
                    value={verifiedBuyerRating}
                    onChange={(e) => setVerifiedBuyerRating(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Verified Buyer Number"
                    fullWidth
                    value={verifiedBuyerNumber}
                    onChange={(e) => setVerifiedBuyerNumber(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Top Flavor Rated"
                    fullWidth
                    value={topFlavorRated}
                    onChange={(e) => setTopFlavorRated(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Number of Flavors"
                    fullWidth
                    value={numberOfFlavors}
                    onChange={(e) => setNumberOfFlavors(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
                <TextField
                    label="Average Flavor Rating"
                    fullWidth
                    value={averageFlavorRating}
                    onChange={(e) => setAverageFlavorRating(e.target.value)}
                    style={{ marginTop: '1rem', marginBottom: '1em' }}
                />
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCreatePlanSubmit}>Create Program</Button>
            </DialogActions>
        </Dialog>
    );
};

export default SupplementForm;
