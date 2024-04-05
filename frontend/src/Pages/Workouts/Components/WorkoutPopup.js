import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button, Typography, Divider } from "@mui/material";

const WorkoutPopup = ({ selectedWorkout, onClose }) => {
    if (!selectedWorkout) return null;

    const { userProgramName, userProgramDescription, daysPerWeek, workouts } = selectedWorkout;

    const restDays = []; //Create dummy Rest Day workouts to fill gaps
    for (let i = 1; i <= daysPerWeek; i++) {
        if (!workouts.find(workout => workout.workoutPosition === i)) {
            restDays.push({
                workoutID: i,
                workoutName: "Rest",
                targetGroup: "Rest Day",
                workoutPosition: i,
                activities: []
            });
        }
    }

    //Sort each Workout's activity order
    const sortedWorkouts = workouts.map(workout => ({
        ...workout,
        activities: workout.activities.sort((a, b) => a.position - b.position)
    }));

    //Merge sorted real Workouts and dummy Rest Days and sort by workout position
    const allWorkouts = [...sortedWorkouts, ...restDays].sort((a,b) => a.workoutPosition - b.workoutPosition)

    return (
        <Dialog open={true} onClose={onClose} fullWidth maxWidth="md">
            <DialogTitle>
                <Typography variant="h5" component="div" style={{ fontWeight: "bold" }}>
                {userProgramName}
                </Typography>
            </DialogTitle>
            <DialogContent>
                <DialogContentText style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                    {userProgramDescription}
                    <br/>
                    <br/>
                    Days per Week: {daysPerWeek}
                </DialogContentText>
            <Divider style={{ margin: "20px 0" }} />
            {allWorkouts.map(workout => (
                <div key={workout.workoutID} style={{ marginBottom: "20px" }}>
                    <Typography variant="h6" component="div" style={{ fontWeight: "bold" }}>
                        Day {workout.workoutPosition}: {workout.workoutName}
                    </Typography>
                    <Typography style={{ color: "rgba(0, 0, 0, 0.54)" }}>
                        Targeted Muscle Groups: {workout.targetGroup}
                    </Typography>
                        <div style={{ marginTop: "10px" }}>
                        {workout.activities.map(activity => (
                            <div key={activity.activityID} style={{ marginBottom: "10px", backgroundColor: "#f2f2f2", padding: "10px", borderRadius: "5px" }}>
                                <Typography style={{ textTransform: "capitalize" }}>
                                    {activity.position}: {activity.exerciseName}
                                </Typography>
                                <Typography style={{ marginTop: "5px", color: "rgba(0, 0, 0, 0.54)", textTransform: "capitalize" }}>
                                    Targeted Muscles: {activity.muscleGroup}
                                </Typography>
                                <Typography style={{ marginTop: "5px", color: "rgba(0, 0, 0, 0.54)" }}>
                                    Additional Notes: {activity.notes}
                                </Typography>
                                <Typography style={{ marginTop: "5px", color: "rgba(0, 0, 0, 0.54)" }}>
                                    {activity.reps} Reps | {activity.sets} Sets | RPE {activity.rpe} | Rest Time: {activity.restTime}
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

export default WorkoutPopup;
