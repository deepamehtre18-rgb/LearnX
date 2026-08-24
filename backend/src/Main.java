import java.util.Scanner;
import model.User;

public class Main {
 public static Scanner sc = new Scanner(System.in);
    public static void main(String[] args) {
        User user = null;
        while (true) {

            System.out.println("\n===== LearnX =====");
            System.out.println("1. Admin");
            System.out.println("2. Student");
            System.out.println("3. Trainer");
            System.out.println("4. Exit");

            System.out.print("Enter Choice: ");
            int choice = sc.nextInt();
            sc.nextLine();
            switch (choice) {

                case 1:
                    AdminMenu.adminMenu();
                    break;

                case 2:
                   StudentMenu.studentMenu(user, sc);
                    break;
                case 3:
                    TrainerMenu.showTrainerMenu();
                    break;

                case 4:
                    System.out.println("Thank You!");
                    System.exit(0);

                default:
                    System.out.println("Invalid Choice!");
            }
        }
    }
}