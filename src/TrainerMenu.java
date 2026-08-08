import java.util.Scanner;
public class TrainerMenu {
    static Scanner sc = Main.sc;
    public static void showTrainerMenu() {
        while (true) {
            System.out.println("\n===== TRAINER MENU =====");
            System.out.println("1. Login");
            System.out.println("2. Back");
            System.out.print("Enter Choice: ");

            int choice = sc.nextInt();
            sc.nextLine();

            switch (choice) {

                case 1:
                    System.out.println("Trainer Login Successful!");
                    TrainerDashboard.trainerDashboard();
                    break;

                case 2:
                    return;

                default:
                    System.out.println("Invalid Choice!");
            }
        }
    }
}