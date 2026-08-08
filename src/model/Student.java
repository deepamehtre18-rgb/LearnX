package model;

public class Student extends User {
    private String courseName;
    public Student(int userId, String name, String email, 
        String password, String role, String courseName) {

            super(userId, name, email, password, role);
            this.courseName = courseName;
        }

        public String getCourseName() {
            return courseName;
        }

        public void setCourseName(String courseName) {
            this.courseName = courseName;
        }
}
