import java.util.Date;

public class User {
    private int userID;
    private Date bday;
    private String lname;
    private String fname;
    private double weight;
    private int age;
    private String phone;
    private String email;
    
    // Constructor
    public User(int userID, Date bday, String lname, String fname, double weight, int age, String phone, String email) {
        this.userID = userID;
        this.bday = bday;
        this.lname = lname;
        this.fname = fname;
        this.weight = weight;
        this.age = age;
        this.phone = phone;
        this.email = email;
    }
    
    // Getters and Setters
    public int getUserID() {
        return userID;
    }

    public void setUserID(int userID) {
        this.userID = userID;
    }

    public Date getBday() {
        return bday;
    }

    public void setBday(Date bday) {
        this.bday = bday;
    }

    public String getLname() {
        return lname;
    }

    public void setLname(String lname) {
        this.lname = lname;
    }

    public String getFname() {
        return fname;
    }

    public void setFname(String fname) {
        this.fname = fname;
    }

    public double getWeight() {
        return weight;
    }

    public void setWeight(double weight) {
        this.weight = weight;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getPhone() {
        return phone;
    }

    public void setPhone(String phone) {
        this.phone = phone;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }
}
