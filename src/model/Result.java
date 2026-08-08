package model;

public class Result {

    private int studentId;
    private String studentName;
    private String quizTitle;
    private int score;
    private int totalMarks;

    // Default Constructor
    public Result() {
    }

    // Parameterized Constructor
    public Result(int studentId, String studentName, String quizTitle, int score, int totalMarks) {
        this.studentId = studentId;
        this.studentName = studentName;
        this.quizTitle = quizTitle;
        this.score = score;
        this.totalMarks = totalMarks;
    }

    // Getters
    public int getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public String getQuizTitle() {
        return quizTitle;
    }

    public int getScore() {
        return score;
    }

    public int getTotalMarks() {
        return totalMarks;
    }

    // Setters
    public void setStudentId(int studentId) {
        this.studentId = studentId;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }

    public void setScore(int score) {
        this.score = score;
    }

    public void setTotalMarks(int totalMarks) {
        this.totalMarks = totalMarks;
    }
}