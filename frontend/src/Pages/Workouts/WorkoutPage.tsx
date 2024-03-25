import React, { useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItem, ListItemText, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

import StarBorderIcon from '@mui/icons-material/StarBorder';
import StarIcon from '@mui/icons-material/Star';

interface WorkoutItem {
    id: number;
    title: string;
    description: string;
}

const WorkoutPage: React.FC = () => {
    // Generating 30 dummy items
    const dummyItems: WorkoutItem[] = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        title: `Workout ${index + 1}`,
        description: `Description for Workout ${index + 1}`,
    }));

    const [selectedItem, setSelectedItem] = useState<WorkoutItem | null>(null);

    const handleClick = (item: WorkoutItem) => {
        setSelectedItem(item);
    };

    const handleClose = () => {
        setSelectedItem(null);
    };

    return (
        <div>
            <TopBar title="Workouts" titleColor="#ffffff"/>
            <div style={{ position: 'absolute', top: '60px', bottom: '0', width: '100%' }}>
                <List>
                    {dummyItems.map(item => (
                        <ListItem key={item.id} onClick={() => handleClick(item)}>
                            <ListItemText primary={item.title} />
                        </ListItem>
                    ))}
                </List>
            </div>
            <Dialog open={selectedItem !== null} onClose={handleClose}>
                <DialogTitle>{selectedItem?.title}</DialogTitle>
                <DialogContent>
                    <DialogContentText>
                        {selectedItem?.description}
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
