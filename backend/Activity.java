public class Activity {
    private int activityId;
    private int exerciseId;
    private int sets;
    private int reps;
    private int rpe;
    private int restTime;

    // Constructor
    public Activity(int activityId, int exerciseId, int sets, int reps, int rpe, int restTime) {
        this.activityId = activityId;
        this.exerciseId = exerciseId;
        this.sets = sets;
        this.reps = reps;
        this.rpe = rpe;
        this.restTime = restTime;
    }

    // Getters and Setters
    public int getActivityId() {
        return activityId;
    }

    public void setActivityId(int activityId) {
        this.activityId = activityId;
    }

    public int getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(int exerciseId) {
        this.exerciseId = exerciseId;
    }

    public int getSets() {
        return sets;
    }

    public void setSets(int sets) {
        this.sets = sets;
    }

    public int getReps() {
        return reps;
    }

    public void setReps(int reps) {
        this.reps = reps;
    }

    public int getRpe() {
        return rpe;
    }

    public void setRpe(int rpe) {
        this.rpe = rpe;
    }

    public int getRestTime() {
        return restTime;
    }

    public void setRestTime(int restTime) {
        this.restTime = restTime;
    }
}
