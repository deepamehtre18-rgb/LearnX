import db.QuizDAO;
import java.util.Scanner;
import model.Quiz;
public class AdminMenu {
  static  Scanner sc = Main.sc;

    public static void adminMenu() {
    while (true) {

    System.out.println("\n===== QUIZ MENU =====");
    System.out.println("1. Add Quiz");
    System.out.println("2. View Quizzes");
    System.out.println("3. Delete Quiz");
    System.out.println("4. Back");

    System.out.print("Enter Choice: ");
    int choice = sc.nextInt();

    QuizDAO quizDAO = new QuizDAO();

    switch (choice) {

        case 1:
            System.out.print("Enter User ID: ");
            int userId = sc.nextInt();

            System.out.print("Enter Course ID: ");
            int courseId = sc.nextInt();

            System.out.print("Enter Score: ");
            int score = sc.nextInt();

            Quiz quiz = new Quiz(0, userId, courseId, score);
            quizDAO.addQuiz(quiz);
            break;

        case 2:
            quizDAO.viewQuiz();
            break;

        case 3:
            System.out.print("Enter Quiz ID: ");
            int quizId = sc.nextInt();
            quizDAO.deleteQuiz(quizId);
            break;

        case 4:
            return;

        default:
            System.out.println("Invalid Choice!");
    }
}
}
}