export interface WorkoutItem { //Define interface for a singular complete User Program
    userProgramID: number;
    userProgramName: string;
    userProgramDescription: string;
    userProgramOwner: number;
    daysPerWeek: number;
    image: string;
    workouts: {
        workoutID: number;
        workoutName: string;
        targetGroup: string;
        workoutPosition: number;
        activities: {
            activityID: number;
            exerciseID: number;
            exerciseName: string;
            muscleGroup: string;
            reps: string;
            sets: number;
            rpe: number;
            restTime: string;
            notes: string;
            position: number;
        }[];
    }[];
}