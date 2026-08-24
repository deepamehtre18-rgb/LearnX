package model;

public class Admin extends User {

    private String department;

    public Admin(int userId, String name, String email,
                 String password, String role, String department) {

        super(userId, name, email, password, role);
        this.department = department;
    }

    public String getDepartment() {
        return department;
    }

    public void setDepartment(String department) {
        this.department = department;
    }
}
