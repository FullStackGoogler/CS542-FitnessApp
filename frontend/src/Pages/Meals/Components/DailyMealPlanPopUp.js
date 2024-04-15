import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Divider } from "@mui/material";

const DailyMealPlanPopUp = ({selectedDailyMealPlan, onClose }) => {
    if (!selectedDailyMealPlan) return null;

    const { mealPlanID, mealDescription, dailyMealPlan} =selectedDailyMealPlan;

    console.log(dailyMealPlan)
    const allDaily = [...dailyMealPlan].sort((a,b) => a.day - b.day)
    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h5" component="div" style={{ fontWeight: "bold" }}>
                    {mealPlanID}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{ color: "#0000008a" }}>
                    {mealDescription}
                    <br/>
                </DialogContentText>
            {allDaily.map(dailyPlan => (
                <div key={dailyPlan.mealID} style={{ marginBottom: "20px" }}>
                    <Divider style={{ margin: "20px 0" }} />
                    <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                        Options {dailyPlan.day}
                    </Typography>
                        <div style={{ marginTop: "10px" }}>
                        {dailyPlan.meals.map(meal => (
                            <div key={meal.activityID} style={{ marginBottom: "10px", backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "5px" }}>
                                <Typography style={{ textTransform: "capitalize" }}>
                                   {meal.mealName} x {meal.servings} Servings
                                </Typography>
                                <Typography style={{ marginTop: "5px", color: "#0000008a", textTransform: "capitalize" }}>
                                    Calories: {meal.calories}
                                </Typography>
                                <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                    Fat: {meal.fat}
                                </Typography>
                                <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                    Carbohydrate: {meal.carbs}
                                </Typography>
                                <Typography style={{ marginTop: "5px", color: "#0000008a" }}>
                                    Protein: {meal.protein}
                                </Typography>
                            </div>
                        ))}
                        </div>
                </div>
            ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="primary">
                Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default DailyMealPlanPopUp;
