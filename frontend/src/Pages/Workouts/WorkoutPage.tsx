import React, { useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItemButton, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import ListItem  from "./Components/WorkoutListItem"

// TODO: Adjust for the final iteration of the popup
interface WorkoutPopup {
    id: number;
    title: string;
    description: string;
}

const WorkoutPage: React.FC = () => {
    // TODO: Replace dummies with actual data from AWS RDS
    const dummyItems = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        title: `Workout ${index + 1}`,
        description: `Description for Workout ${index + 1}`,
        daysPerWeek: 5,
        image: `https://via.placeholder.com/150/FF5733/FFFFFF/?text=Workout+${index + 1}`, // TODO: Find a default workout picture
    }));

    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutPopup | null>(null); 

    const handleClick = (item: WorkoutPopup) => {
        setSelectedWorkout(item);
    };

    const handleClose = () => {
        setSelectedWorkout(null);
    };

    return (
        <div>
            <TopBar title="Workouts" titleColor="#ffffff"/>
            <div style={{ position: 'absolute', top: '60px', bottom: '0', width: '100%' }}>
                <List>
                    {dummyItems.map(item => (
                        <ListItemButton>
                            <ListItem key={item.id} workout={item} onClick={() => handleClick(item)} />
                        </ListItemButton>
                    ))}
                </List>
            </div>
            <Dialog open={selectedWorkout !== null} onClose={handleClose}>
                <DialogTitle>{selectedWorkout?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedWorkout?.description}
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleClose}>Close</Button>
                </DialogActions>
            </Dialog>
        </div>
    );
}

export default WorkoutPage;
