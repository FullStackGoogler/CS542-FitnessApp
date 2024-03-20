import java.util.ArrayList;

public class Workout {
    private int workoutId;
    private String name;
    private ArrayList<Activity> activities;

    // Constructor
    public Workout(int workoutId, String name) {
        this.workoutId = workoutId;
        this.name = name;
        this.activities = new ArrayList<>();
    }

    // Getters and Setters
    public int getWorkoutId() {
        return workoutId;
    }

    public void setWorkoutId(int workoutId) {
        this.workoutId = workoutId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public ArrayList<Activity> getActivities() {
        return activities;
    }

    public void setActivities(ArrayList<Activity> activities) {
        this.activities = activities;
    }

    public void addActivity(Activity activity) {
        this.activities.add(activity);
    }

    public void removeActivity(Activity activity) {
        this.activities.remove(activity);
    }
}
