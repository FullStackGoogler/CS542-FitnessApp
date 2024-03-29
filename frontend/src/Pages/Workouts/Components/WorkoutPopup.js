import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const WorkoutPopup = ({ selectedWorkout, onClose }) => {
    if (!selectedWorkout) return null;

    const { title, description, daysPerWeek, workouts } = selectedWorkout;

    return (
        <Dialog open={true} onClose={onClose} sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1000px",
              },
            },
          }}>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent >
                <DialogContentText>
                    {description}
                    <br />
                    Number of days per week: {daysPerWeek}
                </DialogContentText>
                {workouts.map(workout => (
                    <div key={workout.id}>
                        <h3>{workout.title} ({workout.targetedMuscles})</h3>
                        <ul>
                            {workout.activities.map(activity => (
                                <li key={activity.id}>
                                    {activity.name}<br />
                                    {activity.reps} reps for {activity.sets} sets, {activity.rpe} RPE, {activity.restTime} min Rest Time
                                </li>
                            ))}
                        </ul>
                    </div>
                ))}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose}>Close</Button>
            </DialogActions>
        </Dialog>
    );
}

export default WorkoutPopup;
