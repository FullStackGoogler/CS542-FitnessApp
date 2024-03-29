import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";

const WorkoutPopup = ({ selectedWorkout, onClose }) => {
    if (!selectedWorkout) return null;

    const { userProgramName, userProgramDescription, daysPerWeek, workouts } = selectedWorkout;

    return (
        <Dialog open={true} onClose={onClose} sx={{
            "& .MuiDialog-container": {
              "& .MuiPaper-root": {
                width: "100%",
                maxWidth: "1000px",
              },
            },
          }}>
            <DialogTitle>{userProgramName}</DialogTitle>
            <DialogContent >
                <DialogContentText>
                    {userProgramDescription}
                    <br />
                    Number of days per week: {daysPerWeek}
                </DialogContentText>
                {workouts.map(workout => (
                    <div key={workout.workoutID}>
                        <h3>{workout.workoutName} ({workout.targetGroup})</h3>
                        <ul>
                            {workout.activities.map(activity => (
                                <li key={activity.activityID}>
                                    {activity.exerciseID}<br />
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
