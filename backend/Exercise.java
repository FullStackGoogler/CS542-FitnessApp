public class Exercise {
    private int exerciseId;
    private String name;
    private String muscleGroup;
    private String videoLink;

    // Constructor
    public Exercise(int exerciseId, String name, String muscleGroup, String videoLink) {
        this.exerciseId = exerciseId;
        this.name = name;
        this.muscleGroup = muscleGroup;
        this.videoLink = videoLink;
    }

    // Getters and Setters
    public int getExerciseId() {
        return exerciseId;
    }

    public void setExerciseId(int exerciseId) {
        this.exerciseId = exerciseId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getMuscleGroup() {
        return muscleGroup;
    }

    public void setMuscleGroup(String muscleGroup) {
        this.muscleGroup = muscleGroup;
    }

    public String getVideoLink() {
        return videoLink;
    }

    public void setVideoLink(String videoLink) {
        this.videoLink = videoLink;
    }
}
