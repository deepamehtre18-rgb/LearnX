package model;

public class Course {

    private int courseId;
    private String courseName;
    private String trainerName;
    private String duration;
    private double fees;

    // Constructor
    public Course(int courseId, String courseName, String trainerName, String duration, double fees) {
        this.courseId = courseId;
        this.courseName = courseName;
        this.trainerName = trainerName;
        this.duration = duration;
        this.fees = fees;
    }

    // Getters
    public int getCourseId() {
        return courseId;
    }

    public String getCourseName() {
        return courseName;
    }

    public String getTrainerName() {
        return trainerName;
    }

    public String getDuration() {
        return duration;
    }

    public double getFees() {
        return fees;
    }

    // Setters
    public void setCourseId(int courseId) {
        this.courseId = courseId;
    }

    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    public void setTrainerName(String trainerName) {
        this.trainerName = trainerName;
    }

    public void setDuration(String duration) {
        this.duration = duration;
    }

    public void setFees(double fees) {
        this.fees = fees;
    }
}