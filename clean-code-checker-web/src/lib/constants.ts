export const MAX_JAVA_FILE_BYTES = 5 * 1024 * 1024;
export const OPENAI_MODEL = process.env.OPENAI_MODEL || "gpt-5.5";

export const DEMO_JAVA_CODE = `import java.sql.*;
import java.util.*;

public class UserRepository {
    private Connection connection;

    public UserRepository(Connection connection) {
        this.connection = connection;
    }

    public User findByEmail(String email) throws SQLException {
        String sql = "SELECT * FROM users WHERE email = '" + email + "'";
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery(sql);

        if (resultSet.next()) {
            User user = new User();
            user.setId(resultSet.getInt("id"));
            user.setEmail(resultSet.getString("email"));
            user.setName(resultSet.getString("name").trim());
            return user;
        }

        return null;
    }

    public List<User> getActiveUsers() throws SQLException {
        List<User> users = new ArrayList<>();
        Statement statement = connection.createStatement();
        ResultSet resultSet = statement.executeQuery("SELECT * FROM users");

        while (resultSet.next()) {
            if (resultSet.getBoolean("active")) {
                User user = new User();
                user.setId(resultSet.getInt("id"));
                user.setEmail(resultSet.getString("email"));
                users.add(user);
            }
        }

        return users;
    }
}`;
