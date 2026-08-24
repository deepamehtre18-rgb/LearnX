import db.UserDAO;
import java.util.Scanner;
import model.User;
public class StudentMenu {

    static Scanner sc = new Scanner(System.in);

    public static void studentMenu(User user, Scanner sc) {

        while (true) {

            System.out.println("\n===== STUDENT MENU =====");
            System.out.println("1. Register");
            System.out.println("2. Login");
            System.out.println("3. Back");

            System.out.print("Enter Choice: ");
            int choice = sc.nextInt();
            sc.nextLine();

            UserDAO userDAO = new UserDAO();

            switch (choice) {

                case 1:

                    System.out.print("Enter Name: ");
                    String name = sc.nextLine();

                    System.out.print("Enter Email: ");
                    String email = sc.nextLine();

                    System.out.print("Enter Password: ");
                    String password = sc.nextLine();

                    User newUser = new User();

                    newUser.setName(name);
                    newUser.setEmail(email);
                    newUser.setPassword(password);
                    newUser.setRole("student");

                    if (userDAO.registerUser(newUser)) {
                        System.out.println("Registration Successful!");
                    } else {
                        System.out.println("Registration Failed!");
                    }

                    break;

                case 2:

                    System.out.print("Enter Email: ");
                    email = sc.nextLine();

                    System.out.print("Enter Password: ");
                    password = sc.nextLine();

                    user = userDAO.loginUser(email, password);

                    if (user != null) {

                        System.out.println("Login Successful!");

                        StudentDashboard.studentDashboard(user, sc);

                        return;

                    } else {

                        System.out.println("Invalid Email or Password!");

                    }

                    break;

                case 3:

                    return;

                default:

                    System.out.println("Invalid Choice!");
            }
        }
    }
}