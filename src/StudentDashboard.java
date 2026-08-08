import db.CourseDAO;
import db.QuizDAO;
import db.ResultDAO;
import java.util.Scanner;
import model.User;
public class StudentDashboard {

    public static void studentDashboard(User user, Scanner sc) {

        while (true) {

            System.out.println("\n===== STUDENT DASHBOARD =====");
            System.out.println("1. View Courses");
            System.out.println("2. Take Quiz");
            System.out.println("3. View Result");
            System.out.println("4. Logout");

            System.out.print("Enter Choice: ");
            int choice = sc.nextInt();

            switch (choice) {

                case 1:
                    CourseDAO courseDAO = new CourseDAO();
                    courseDAO.viewCourses();
                    break;

                case 2:
                    QuizDAO quizDAO = new QuizDAO();
                    quizDAO.takeQuiz(user, sc);
                    break;

                case 3:
                    ResultDAO resultDAO = new ResultDAO();
                    resultDAO.viewResults(user);
                    break;

                case 4:
                    System.out.println("Logged out successfully!");
                    return;

                default:
                    System.out.println("Invalid Choice!");
            }
        }
    }
}