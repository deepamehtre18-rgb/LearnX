package db;
import java.sql.Connection;
import java.sql.DriverManager;
public class DBConnection {

    public static Connection getConnection() {

        String url = System.getenv("DB_URL");
        String username = System.getenv("DB_USERNAME");
        String password = System.getenv("DB_PASSWORD");

        System.out.println("DB_URL exists: " +
                (url != null && !url.isEmpty()));

        System.out.println("DB_USERNAME exists: " +
                (username != null && !username.isEmpty()));

        System.out.println("DB_PASSWORD exists: " +
                (password != null && !password.isEmpty()));

        try {

            if (url == null || url.isEmpty()) {
                throw new RuntimeException(
                        "DB_URL environment variable is missing"
                );
            }
            if (username == null || username.isEmpty()) {
                throw new RuntimeException(
                        "DB_USERNAME environment variable is missing"
                );
            }

            if (password == null || password.isEmpty()) {
                throw new RuntimeException(
                        "DB_PASSWORD environment variable is missing"
                );
            }

            Class.forName("com.mysql.cj.jdbc.Driver");

            Connection connection =
                    DriverManager.getConnection(
                            url,
                            username,
                            password
                    );

            System.out.println(
                    "DATABASE CONNECTED SUCCESSFULLY"
            );

            System.out.println(
                    "Database = " + connection.getCatalog()
            );

            return connection;

        } catch (Exception e) {

            System.out.println(
                    "DATABASE CONNECTION FAILED"
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Database connection failed: " +
                    e.getMessage(),
                    e
            );
        }
    }
}