package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.Course;
public class CourseDAO {

    public boolean addCourse(Course course) {

        String query = "INSERT INTO courses(course_name, trainer_name, duration, fees) VALUES (?, ?, ?, ?)";

        try {
            Connection connection = DBConnection.getConnection();

            PreparedStatement ps = connection.prepareStatement(query);

            ps.setString(1, course.getCourseName());
            ps.setString(2, course.getTrainerName());
            ps.setString(3, course.getDuration());
            ps.setDouble(4, course.getFees());

            int rows = ps.executeUpdate();

            if (rows > 0) {
                System.out.println("Course Added Successfully!");
                return true;
            }

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
        }


   public void viewCourses() {

    String query = "SELECT * FROM courses";

    try {
        Connection connection = DBConnection.getConnection();

        PreparedStatement ps = connection.prepareStatement(query);

        ResultSet rs = ps.executeQuery();

        System.out.println("===== COURSES =====");

        while (rs.next()) {
            System.out.println("---------------------");
            System.out.println("Course ID : " + rs.getInt("course_id"));
            System.out.println("Course Name : " + rs.getString("course_name"));
            System.out.println("Trainer Name : " + rs.getString("trainer_name"));
            System.out.println("Duration : " + rs.getString("duration"));
            System.out.println("Fees : " + rs.getDouble("fees"));
        }

    } catch (SQLException e) {
        e.printStackTrace();
    }
}


public void deleteCourse(int id) {
    String query = "DELETE FROM courses WHERE course_id = ?";

    try {
        Connection connection = DBConnection.getConnection();
        PreparedStatement ps = connection.prepareStatement(query);

        ps.setInt(1, id);

        int rows = ps.executeUpdate();

        if (rows > 0) {
            System.out.println("Course Deleted Successfully!");
        } else {
            System.out.println("Course Not Found!");
        }

    } catch (SQLException e) {
        e.printStackTrace();
    }
}
}