package db;

import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.sql.SQLException;
import model.User;

public class UserDAO {

    // Register User
    public boolean registerUser(User user) {

        String query = "INSERT INTO users(name,email,password,role) VALUES(?,?,?,?)";

        try {
            Connection connection = DBConnection.getConnection();
            PreparedStatement ps = connection.prepareStatement(query);

            ps.setString(1, user.getName());
            ps.setString(2, user.getEmail());
            ps.setString(3, user.getPassword());
            ps.setString(4, user.getRole());

            return ps.executeUpdate() > 0;

        } catch (SQLException e) {
            e.printStackTrace();
        }

        return false;
    }

    // Login User
    public User loginUser(String email, String password) {

        String query = "SELECT * FROM users WHERE email = ? AND password = ?";

        try {
            Connection connection = DBConnection.getConnection();

            System.out.println("Database = " + connection.getCatalog());

            PreparedStatement test = connection.prepareStatement("SELECT COUNT(*) FROM users");
            ResultSet countRs = test.executeQuery();

            if (countRs.next()) {
                System.out.println("Total Users = " + countRs.getInt(1));
            }

            PreparedStatement ps = connection.prepareStatement(query);
            email = email.trim();
            password = password.trim();
            ps.setString(1, email);
            ps.setString(2, password);

           ResultSet rs = ps.executeQuery();

boolean found = rs.next();
System.out.println("Has Record: " + found);
System.out.println("Email: " + email);
System.out.println("Password: " + password);

if (found) {
    return new User(
        rs.getInt("user_id"),
        rs.getString("name"),
        rs.getString("email"),
        rs.getString("password"),
        rs.getString("role")
    );
}


        } catch (SQLException e) {
            e.printStackTrace();
        }

        return null;
    }
}