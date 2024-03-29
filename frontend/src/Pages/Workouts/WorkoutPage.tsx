import React, { useState } from "react";
import TopBar from "../../Components/TopBar";
import { List, ListItemButton, Button } from "@mui/material";
import ListItem  from "./Components/WorkoutListItem"
import WorkoutPopup from "./Components/WorkoutPopup"

const WorkoutPage: React.FC = () => {
    interface WorkoutItem {
        id: number;
        title: string;
        description: string;
        daysPerWeek: number;
        image: string;
        workouts: {
            id: number;
            title: string;
            targetedMuscles: string;
            activities: {
                id: number;
                name: string;
                reps: number;
                sets: number;
                rpe: number;
                restTime: number;
            }[];
        }[];
    }

    const [selectedWorkout, setSelectedWorkout] = useState<WorkoutItem | null>(null); 

    fetch('http://localhost:8080/api/exercises')
        .then(response => response.json())
        .then(data => {
            console.log('Exercises:', data);
        })
        .catch(error => console.error('Error:', error));

    //Chat GPT generated dummy data; replace with actual DB data
    const dummyItems = Array.from({ length: 30 }, (_, index) => ({
        id: index + 1,
        title: `User Program ${index + 1}`,
        description: `Description for Program ${index + 1}`,
        daysPerWeek: 5,
        image: `https://via.placeholder.com/150/FF5733/FFFFFF/?text=Workout+${index + 1}`,
        workouts: Array.from({ length: 3 }, (_, i) => ({
            id: i + 1,
            title: `Workout ${i + 1}`,
            targetedMuscles: "Muscles",
            activities: Array.from({ length: 3 }, (_, j) => ({
                id: j + 1,
                name: `Activity ${j + 1}`,
                reps: 8,
                sets: 5,
                rpe: 5,
                restTime: 2
            }))
        }))
    }));

    const handleClick = (item: WorkoutItem) => {
        setSelectedWorkout(item);
    };

    const handleClose = () => {
        setSelectedWorkout(null);
    };
    //TODO: Use CSS to better align these
    return (
        <div>
            <TopBar title="Workouts" titleColor="#ffffff"/>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '75px 10px' }}>
                <div style={{ fontSize: '24px', fontWeight: 'bold' }}>List of User Programs</div>
                <Button variant="contained" color="primary">Add a Program</Button>
            </div>
            <div style={{ position: 'absolute', top: '125px', bottom: '0', width: '100%' }}>
                <List>
                    {dummyItems.map(item => (
                        <ListItemButton>
                            <ListItem key={item.id} workout={item} onClick={() => handleClick(item)} />
                        </ListItemButton>
                    ))}
                </List>
            </div>
            <WorkoutPopup selectedWorkout={selectedWorkout} onClose={handleClose} />
        </div>
    );
}

export default WorkoutPage;
