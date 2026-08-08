package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Result;
import model.User;
public class ResultDAO {

    public boolean addResult(Result result) {

        String query = "INSERT INTO results(student_id, student_name, quiz_title, score, total_marks) VALUES(?,?,?,?,?)";

        try {

            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(query);

            ps.setInt(1, result.getStudentId());
            ps.setString(2, result.getStudentName());
            ps.setString(3, result.getQuizTitle());
            ps.setInt(4, result.getScore());
            ps.setInt(5, result.getTotalMarks());

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

        String query = "SELECT * FROM results WHERE student_id = ?";
try{
            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(query);
            System.err.println("Logged User ID = " + user.getUserId());
            System.err.println("Logged User Nmae = " + user.getName());
            ps.setInt(1, user.getUserId());

            ResultSet rs = ps.executeQuery();

           while (rs.next()) {
    System.out.println("------------------------");
   System.out.println("Student ID   : " + rs.getInt("student_id"));
System.out.println("Student Name : " + rs.getString("student_name"));
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