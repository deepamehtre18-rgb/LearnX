import db.QuizDAO;
import java.util.Scanner;
import model.Quiz;

public class TrainerDashboard {

    public static void trainerDashboard() {
        Scanner sc = Main.sc;
        QuizDAO quizDAO = new QuizDAO();
        while (true) {
            System.out.println("\n===== TRAINER DASHBOARD =====");
            System.out.println("1. Add Quiz");
            System.out.println("2. View Quiz");
            System.out.println("3. Logout");

            System.out.print("Enter Choice: ");
            int choice = Main.sc.nextInt();
            Main.sc.nextLine();

             
            switch (choice) {
                case 1:
    Quiz quiz = new Quiz();

    System.out.print("Enter User ID: ");
    quiz.setUserId(sc.nextInt());

    System.out.print("Enter Course ID: ");
    quiz.setCourseId(sc.nextInt());

    System.out.print("Enter Score: ");
    quiz.setScore(sc.nextInt());
    quizDAO.addQuiz(quiz);

    break;

                case 2:
                   quizDAO.viewQuiz();
                    break;

                case 3:
                    return;

                default:
                    System.out.println("Invalid Choice");
            }
        }
    }
}