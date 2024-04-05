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
            <DialogTitle>{selectedSupplement.product_name}</DialogTitle>
            <DialogContent >
                <DialogContentText>
                    Category : {selectedSupplement.product_category}
                    <br />
                    {'Description:' + selectedSupplement.product_description}
                    <br />
                    {'Brand Name: ' + selectedSupplement.brand_name}
                    <br />
                    {'Link: ' + selectedSupplement.link}
                    <br />
                    {'Price: ' + selectedSupplement.price}
                    <br />
                    {'Price per serving: ' + selectedSupplement.price_per_serving}
                    <br />
                    {'Overall Rating: ' + selectedSupplement.overall_rating}
                    <br />
                    {'Number of Reviews: ' + selectedSupplement.number_of_reviews}
                    <br />
                    {'Verified Buyer Rating: ' + selectedSupplement.verified_buyer_rating}
                    <br />
                    {'Verified Buyer Number: ' + selectedSupplement.verified_buyer_number}
                    <br />
                    {'Top Flavor Rated: ' + selectedSupplement.top_flavor_rated}
                    <br />
                    {'Number of Flavors: ' + selectedSupplement.number_of_flavors}
                    <br />
                    {'Average Flavor Rating: ' + selectedSupplement.average_flavor_rating}
                </DialogContentText>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SupplementPopup;
