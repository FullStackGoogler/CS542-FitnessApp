import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Divider} from "@mui/material";

const SupplementPopup = ({ selectedSupplement, onClose }) => {
    if (!selectedSupplement) return null;

    //const { nutritionPlanName, calorieGoal, proteinGoal, carbGoal, fatGoal} = selectedSupplement;

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h5" component="div" style={{ fontWeight: "bold" }}>
                  {selectedSupplement.product_name}
                </Typography>
            </DialogTitle>
            <DialogContent >
                <DialogContentText style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                        {selectedSupplement.product_category}
                        <br/>
                        <br/>
                </DialogContentText>
                <DialogContentText style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                        {selectedSupplement.product_description}
                        <br/>
                        <br/>
                </DialogContentText>
                <Divider style={{ margin: "20px 0" }} />

                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {'Brand Name: ' + selectedSupplement.brand_name}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {'Link: ' + selectedSupplement.link}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {'Price: ' + selectedSupplement.price}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {'Price per serving: ' + selectedSupplement.price_per_serving}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h7" component="div" style={{ fontWeight: "bold" }}>
                    {'Price per serving: ' + selectedSupplement.price_per_serving}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {'Overall Rating: ' + selectedSupplement.overall_rating}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h7" component="div" style={{ fontWeight: "bold" }}>
                    {'Number of Reviews: ' + selectedSupplement.number_of_reviews}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h7" component="div" style={{ fontWeight: "bold" }}>
                    {'Verified Buyer Rating: ' + selectedSupplement.verified_buyer_rating}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h7" component="div" style={{ fontWeight: "bold" }}>
                    {'Verified Buyer Number: ' + selectedSupplement.verified_buyer_number}
                </Typography>

                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                    {'Top Flavor Rated: ' + selectedSupplement.top_flavor_rated}
                </Typography>
                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h7" component="div" style={{ fontWeight: "bold" }}>
                    {'Number of Flavors: ' + selectedSupplement.number_of_flavors}
                </Typography>
                <Divider style={{ margin: "20px 0" }} />
                <Typography variant="h7" component="div" style={{ fontWeight: "bold" }}>
                    {'Average Flavor Rating: ' + selectedSupplement.average_flavor_rating}
                </Typography>
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default SupplementPopup;
