package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Result;
import model.User;
public class ResultDAO {

    public boolean addResult(Result result) {

        String query = "INSERT INTO results(student_id, quiz_title, score, total_marks) VALUES(?,?,?,?)";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(query);

            ps.setInt(1, result.getStudentId());
            ps.setString(2, result.getQuizTitle());
            ps.setInt(3, result.getScore());
            ps.setInt(4, result.getTotalMarks());

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Result Added Successfully!");
                return true;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }
        return false;
    }

    public void viewResults(User user) {

        String query = "SELECT r.student_id, u.name AS student_name, " +
               "r.quiz_title, r.score, r.total_marks " +
               "FROM results r " +
               "JOIN users u ON r.student_id = u.user_id " +
               "WHERE r.student_id = ?";
        try{
            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(query);
            System.out.println("Logged User ID = " + user.getUserId());
            System.out.println("Logged user Name = " + user.getName());
            ps.setInt(1, user.getUserId());

            ResultSet rs = ps.executeQuery();

            while (rs.next()) {
            System.out.println("------------------------");
            System.out.println("Student ID  : " + rs.getInt("student_id"));
            System.out.println("Student Name : " + rs.getString("Student_name"));
            System.out.println("Quiz Title   : " + rs.getString("quiz_title"));
            System.out.println("Score        : " + rs.getInt("score"));
            System.out.println("Total Marks  : " + rs.getInt("total_marks"));
        }

        } catch (SQLException e) {
            e.printStackTrace();
        }
    }

    public boolean updateResult(int studentId, int newScore) {

        String query = "UPDATE results SET score = ? WHERE student_id = ?";
        try {
            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(query);

            ps.setInt(1, newScore);
            ps.setInt(2, studentId);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Result Updated Successfully!");
                return true;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    public boolean deleteResult(int studentId) {

        String query = "DELETE FROM results WHERE student_id = ?";

        try {
            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(query);

            ps.setInt(1, studentId);

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Result Deleted Successfully!");
                return true;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }
}