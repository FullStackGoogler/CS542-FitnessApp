public class DatabaseSetup {
    public static String createUsersTableSQL() {
        StringBuilder sql = new StringBuilder();
        sql.append("CREATE TABLE users (");
        sql.append("userID SERIAL PRIMARY KEY,");
        sql.append("bday DATE,");
        sql.append("lname VARCHAR(255),");
        sql.append("fname VARCHAR(255),");
        sql.append("weight DECIMAL,");
        sql.append("age INT,");
        sql.append("phone VARCHAR(20),");
        sql.append("email VARCHAR(255)");
        sql.append(");");
        return sql.toString();
    }

    public static void main(String[] args) {
        String createUserTableSQL = createUsersTableSQL();
        System.out.println(createUserTableSQL);
    }
}
