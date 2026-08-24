package model;

public class Quiz {
    private int quizId;
    private int userId;
    private int courseId;
    private int score;

    public Quiz(int quizId, int userId, int courseId, int score) {
        this.quizId = quizId;
        this.userId = userId;
        this.courseId = courseId;
        this.score = score;
    }
    public int getQuizId() {
        return quizId;
    }
    public int getUserId() {
        return userId;
    }
    public int getCourseId() {
        return courseId;
    }
    public int getScore() {
        return score;
    }

    public Quiz() {
    }
        public void setQuizId(int quizId) {
    this.quizId = quizId;
}

public void setUserId(int userId) {
    this.userId = userId;
}

public void setCourseId(int courseId) {
    this.courseId = courseId;
}

public void setScore(int score) {
    this.score = score;
}
}
