package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.Scanner;
import model.Quiz;
import model.User;

public class QuizDAO {

    // Add quiz attempt
    public void addQuiz(Quiz quiz) {

        try {

            Connection con = DBConnection.getConnection();

            String query =
                    "INSERT INTO quiz(user_id, course_id, score) VALUES(?,?,?)";

            PreparedStatement ps = con.prepareStatement(query);

            ps.setInt(1, quiz.getUserId());
            ps.setInt(2, quiz.getCourseId());
            ps.setInt(3, quiz.getScore());

            int rows = ps.executeUpdate();

            System.out.println("Rows inserted = " + rows);
            System.out.println("Quiz Added Successfully!");

        } catch (Exception e) {

            e.printStackTrace();

        }
    }


    // View all quiz attempts
    public void viewQuiz() {

        String query = "SELECT * FROM quiz";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps = con.prepareStatement(query);

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {

                System.out.println("----------------------------");

                System.out.println(
                        "Quiz ID : " +
                        rs.getInt("quiz_id")
                );

                System.out.println(
                        "User ID : " +
                        rs.getInt("user_id")
                );

                System.out.println(
                        "Course ID : " +
                        rs.getInt("course_id")
                );

                System.out.println(
                        "Score : " +
                        rs.getInt("score")
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

        }
    }


    // Delete quiz
    public void deleteQuiz(int quizId) {

        String query =
                "DELETE FROM quiz WHERE quiz_id=?";

        try {

            Connection con = DBConnection.getConnection();

            PreparedStatement ps =
                    con.prepareStatement(query);

            ps.setInt(1, quizId);

            int rows = ps.executeUpdate();

            if (rows > 0) {

                System.out.println(
                        "Quiz Deleted Successfully!"
                );

            } else {

                System.out.println(
                        "Quiz Not Found!"
                );
            }

        } catch (Exception e) {

            e.printStackTrace();

        }
    }


    // Take quiz
    public void takeQuiz(User user, Scanner sc) {

        CourseDAO courseDAO = new CourseDAO();

        System.out.println("\n===== AVAILABLE COURSES =====");

        courseDAO.viewCourses();

        System.out.print("Enter Course ID: ");

        int courseId = sc.nextInt();

        QuestionDAO questionDAO =
                new QuestionDAO();

        questionDAO.viewQuestionsByCourse(
                courseId,
                user,
                sc
        );
    }
}