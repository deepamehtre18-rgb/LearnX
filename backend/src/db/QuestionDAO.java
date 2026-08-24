package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import java.util.Scanner;
import model.Question;
import model.Quiz;
import model.Result;
import model.User;

public class QuestionDAO {
    // =========================================================
    // ADD QUESTION
    // =========================================================
    public boolean addQuestion(Question question) {
        String query =
                "INSERT INTO questions(" +
                "course_id, " +
                "question_text, " +
                "option1, " +
                "option2, " +
                "option3, " +
                "option4, " +
                "correct_answer" +
                ") VALUES(?, ?, ?, ?, ?, ?, ?)";
        try {
            Connection connection =
                    DBConnection.getConnection();
            PreparedStatement ps =
                    connection.prepareStatement(query);
            ps.setInt(
                    1,
                    question.getCourseId()
            );
            ps.setString(
                    2,
                    question.getQuestionText()
            );
            ps.setString(
                    3,
                    question.getOption1()
            );
            ps.setString(
                    4,
                    question.getOption2()
            );
            ps.setString(
                    5,
                    question.getOption3()
            );
            ps.setString(
                    6,
                    question.getOption4()
            );
            ps.setString(
                    7,
                    question.getCorrectAnswer()
            );
            int rows =
                    ps.executeUpdate();
            if (rows > 0) {
                System.out.println(
                        "Question Added Successfully!"
                );
                return true;
            }
        } catch (SQLException e) {

            e.printStackTrace();
        }
        return false;
    }

    // =========================================================
    // VIEW ALL QUESTIONS
    // =========================================================
    public void viewQuestions() {
        String query =
                "SELECT * FROM questions";
        try {
            Connection connection =
                    DBConnection.getConnection();
            PreparedStatement ps =
                    connection.prepareStatement(query);
            ResultSet rs =
                    ps.executeQuery();
            while (rs.next()) {
                System.out.println(
                        "----------------------------"
                );
                System.out.println("Question ID : " + rs.getInt("question_id"));
                System.out.println(
                        "Course ID : " +
                        rs.getInt("course_id")
                );
                System.out.println(
                        "Question : " +
                        rs.getString("question_text")
                );
                System.out.println(
                        "1. " +
                        rs.getString("option1")
                );
                System.out.println(
                        "2. " +
                        rs.getString("option2")
                );

                System.out.println(
                        "3. " +
                        rs.getString("option3")
                );

                System.out.println(
                        "4. " +
                        rs.getString("option4")
                );

                System.out.println(
                        "Answer : " +
                        rs.getString("correct_answer")
                );
            }

        } catch (SQLException e) {

            e.printStackTrace();

        }
    }


    // =========================================================
    // DELETE QUESTION
    // =========================================================

    public void deleteQuestion(int questionId) {

        String query =
                "DELETE FROM questions WHERE question_id = ?";

        try {

            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    connection.prepareStatement(query);

            ps.setInt(1, questionId);

            int rows =
                    ps.executeUpdate();

            if (rows > 0) {

                System.out.println(
                        "Question Deleted Successfully!"
                );

            } else {

                System.out.println(
                        "Question Not Found!"
                );
            }

        } catch (SQLException e) {

            e.printStackTrace();

        }
    }


    // =========================================================
    // TAKE QUIZ BY COURSE
    // =========================================================

    public void viewQuestionsByCourse(int courseId, User user, Scanner sc) {
        String query =
                "SELECT * FROM questions WHERE course_id=?";

        try {

            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    connection.prepareStatement(query);

            ps.setInt(1, courseId);

            ResultSet rs =
                    ps.executeQuery();


            int score = 0;

            int totalQuestions = 0;


            // =================================================
            // DISPLAY QUESTIONS
            // =================================================

            while (rs.next()) {

                totalQuestions++;

                System.out.println(
                        "\n--------------------------------"
                );

                System.out.println(
                        rs.getString("question_text")
                );

                System.out.println(
                        "1. " +
                        rs.getString("option1")
                );

                System.out.println(
                        "2. " +
                        rs.getString("option2")
                );

                System.out.println(
                        "3. " +
                        rs.getString("option3")
                );

                System.out.println(
                        "4. " +
                        rs.getString("option4")
                );


                System.out.print(
                        "Enter your answer (1-4): "
                );

                int answer =
                        sc.nextInt();


                String correctAnswer =
                        rs.getString("correct_answer");


                // =============================================
                // CHECK ANSWER
                // =============================================

                if (
                    (answer == 1 &&
                     correctAnswer.equals(
                         rs.getString("option1")
                     ))

                    ||

                    (answer == 2 &&
                     correctAnswer.equals(
                         rs.getString("option2")
                     ))

                    ||

                    (answer == 3 &&
                     correctAnswer.equals(
                         rs.getString("option3")
                     ))

                    ||

                    (answer == 4 &&
                     correctAnswer.equals(
                         rs.getString("option4")
                     ))
                ) {

                    System.out.println(
                            "Correct!"
                    );

                    score++;

                } else {

                    System.out.println(
                            "Wrong!"
                    );
                }
            }


            // =================================================
            // QUIZ COMPLETED
            // =================================================

            System.out.println(
                    "\n===== QUIZ COMPLETED ====="
            );

            System.out.println(
                    "Your Score : " +
                    score +
                    "/" +
                    totalQuestions
            );


            // =================================================
            // SAVE QUIZ
            // =================================================

            Quiz quiz =
                    new Quiz();

            quiz.setUserId(
                    user.getUserId()
            );

            quiz.setCourseId(
                    courseId
            );

            quiz.setScore(
                    score
            );


            QuizDAO quizDAO =
                    new QuizDAO();

            quizDAO.addQuiz(
                    quiz
            );


            // =================================================
            // GET COURSE NAME
            // =================================================

            String courseQuery =
                    "SELECT course_name " +
                    "FROM courses " +
                    "WHERE course_id = ?";


            PreparedStatement coursePs =
                    connection.prepareStatement(
                            courseQuery
                    );

            coursePs.setInt(
                    1,
                    courseId
            );


            ResultSet courseRs =
                    coursePs.executeQuery();


            String quizTitle =
                    "";


            if (courseRs.next()) {

                quizTitle =
                        courseRs.getString(
                                "course_name"
                        );
            }


            // =================================================
            // SAVE RESULT
            // =================================================

            Result result =
                    new Result();

            result.setStudentId(
                    user.getUserId()
            );

            result.setStudentName(
                    user.getName()
            );

            result.setQuizTitle(
                    quizTitle
            );

            result.setScore(
                    score
            );

            result.setTotalMarks(
                    totalQuestions
            );


            ResultDAO resultDAO =
                    new ResultDAO();

            resultDAO.addResult(
                    result
            );


            System.out.println(
                    "\nResult saved successfully!"
            );


        } catch (SQLException e) {

            e.printStackTrace();

        }
    }
}