package model;

public class Trainer extends User {

    private String specialization;

    public Trainer(int userId, String name, String email,
                   String password, String role, String specialization) {

        super(userId, name, email, password, role);
        this.specialization = specialization;
    }

    public String getSpecialization() {
        return specialization;
    }

    public void setSpecialization(String specialization) {
        this.specialization = specialization;
    }
}
