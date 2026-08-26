import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import db.DBConnection;
import db.UserDAO;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;
import java.util.concurrent.Executors;
import model.User;

public class ApiServer {

    public static void main(String[] args) throws Exception {

        // =====================================================
        // PORT
        // =====================================================

        String portEnvironment = System.getenv("PORT");

        int port;

        if (portEnvironment != null && !portEnvironment.isEmpty()) {
            port = Integer.parseInt(portEnvironment);
        } else {
            port = 8080;
        }

        HttpServer server = HttpServer.create(
                new InetSocketAddress("0.0.0.0", port),
                0
        );

        // Allow multiple requests at the same time
        server.setExecutor(
                Executors.newCachedThreadPool()
        );

        // =====================================================
        // API ENDPOINTS
        // =====================================================

        server.createContext(
                "/",
                ApiServer::home
        );

        server.createContext(
                "/api/courses",
                ApiServer::getCourses
        );

        server.createContext(
                "/api/questions",
                ApiServer::getQuestions
        );

        server.createContext(
                "/api/videos",
                ApiServer::getVideos
        );

        server.createContext(
                "/api/register",
                ApiServer::registerUser
        );

        server.createContext(
                "/api/login",
                ApiServer::loginUser
        );

        // =====================================================
        // START SERVER
        // =====================================================

        server.start();

        System.out.println("=================================");
        System.out.println("LearnX API Server Started");
        System.out.println("Running on port: " + port);
        System.out.println("Server is ready to accept requests");
        System.out.println("=================================");
    }


    // =========================================================
    // HOME / HEALTH CHECK
    // GET /
    // =========================================================

    private static void home(HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (handleOptions(exchange)) {
            return;
        }

        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("GET")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );

            return;
        }

        String response =
                "{"
                + "\"success\":true,"
                + "\"message\":\"LearnX API Server is running\""
                + "}";

        sendResponse(
                exchange,
                200,
                response
        );
    }


    // =========================================================
    // REGISTER USER
    // POST /api/register
    // =========================================================

    private static void registerUser(
            HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (handleOptions(exchange)) {
            return;
        }

        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );

            return;
        }

        try {

            String json = new String(
                    exchange.getRequestBody().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            System.out.println(
                    "Register Request Received: " + json
            );

            String name =
                    extractValue(json, "name");

            String email =
                    extractValue(json, "email");

            String password =
                    extractValue(json, "password");

            System.out.println(
                    "Register Email: " + email
            );

            // Validation
            if (name.isEmpty()
                    || email.isEmpty()
                    || password.isEmpty()) {

                sendResponse(
                        exchange,
                        400,
                        "{\"error\":\"Please fill all fields\"}"
                );

                return;
            }

            String role = "STUDENT";

            User user = new User(
                    0,
                    name,
                    email,
                    password,
                    role
            );

            System.out.println(
                    "Connecting to database for registration..."
            );

            UserDAO userDAO = new UserDAO();

            boolean registered =
                    userDAO.registerUser(user);

            System.out.println(
                    "Registration result: " + registered
            );

            if (registered) {

                String response =
                        "{"
                        + "\"success\":true,"
                        + "\"message\":\"Registration successful\""
                        + "}";

                sendResponse(
                        exchange,
                        200,
                        response
                );

            } else {

                String response =
                        "{"
                        + "\"success\":false,"
                        + "\"error\":\"Registration failed. Email may already exist.\""
                        + "}";

                sendResponse(
                        exchange,
                        400,
                        response
                );
            }

        } catch (Exception e) {

            System.err.println(
                    "REGISTER ERROR:"
            );

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "{"
                    + "\"success\":false,"
                    + "\"error\":\"Server error during registration\""
                    + "}"
            );
        }
    }


    // =========================================================
    // LOGIN USER
    // POST /api/login
    // =========================================================

    private static void loginUser(
            HttpExchange exchange)
            throws IOException {

        System.out.println(
                "---------------------------------"
        );

        System.out.println(
                "LOGIN REQUEST RECEIVED"
        );

        System.out.println(
                "Method: "
                        + exchange.getRequestMethod()
        );

        System.out.println(
                "Path: "
                        + exchange.getRequestURI().getPath()
        );

        addCorsHeaders(exchange);

        // Handle browser preflight
        if (handleOptions(exchange)) {

            System.out.println(
                    "OPTIONS request handled"
            );

            return;
        }

        // Only POST allowed
        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("POST")) {

            System.out.println(
                    "Invalid login method"
            );

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );

            return;
        }

        try {

            // =================================================
            // READ REQUEST BODY
            // =================================================

            String json = new String(
                    exchange.getRequestBody().readAllBytes(),
                    StandardCharsets.UTF_8
            );

            System.out.println(
                    "Login Request Body: " + json
            );

            // =================================================
            // EXTRACT EMAIL + PASSWORD
            // =================================================

            String email =
                    extractValue(json, "email");

            String password =
                    extractValue(json, "password");

            System.out.println(
                    "Login Email: " + email
            );

            // DO NOT PRINT PASSWORD IN LOGS

            // =================================================
            // VALIDATION
            // =================================================

            if (email.isEmpty()
                    || password.isEmpty()) {

                System.out.println(
                        "Login validation failed"
                );

                sendResponse(
                        exchange,
                        400,
                        "{"
                        + "\"success\":false,"
                        + "\"error\":\"Please enter email and password\""
                        + "}"
                );

                return;
            }

            // =================================================
            // DATABASE LOGIN
            // =================================================

            System.out.println(
                    "Attempting database login..."
            );

            UserDAO userDAO =
                    new UserDAO();

            User user =
                    userDAO.loginUser(
                            email,
                            password
                    );

            System.out.println(
                    "Database login completed"
            );

            // =================================================
            // USER FOUND
            // =================================================

            if (user != null) {

                System.out.println(
                        "LOGIN SUCCESS: "
                                + user.getEmail()
                );

                /*
                 * IMPORTANT:
                 *
                 * Do NOT send the password back
                 * to the frontend.
                 */

                String response =
                        "{"
                        + "\"success\":true,"
                        + "\"message\":\"Login successful\","
                        + "\"user\":{"
                        + "\"userId\":"
                        + user.getUserId()
                        + ","
                        + "\"name\":\""
                        + escape(user.getName())
                        + "\","
                        + "\"email\":\""
                        + escape(user.getEmail())
                        + "\","
                        + "\"role\":\""
                        + escape(user.getRole())
                        + "\""
                        + "}"
                        + "}";

                sendResponse(
                        exchange,
                        200,
                        response
                );

            }

            // =================================================
            // USER NOT FOUND
            // =================================================

            else {

                System.out.println(
                        "LOGIN FAILED: Invalid credentials for "
                                + email
                );

                sendResponse(
                        exchange,
                        401,
                        "{"
                        + "\"success\":false,"
                        + "\"error\":\"Invalid email or password\""
                        + "}"
                );
            }

        } catch (Exception e) {

            System.err.println(
                    "LOGIN SERVER ERROR:"
            );

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "{"
                    + "\"success\":false,"
                    + "\"error\":\"Server error during login\""
                    + "}"
            );
        }

        System.out.println(
                "---------------------------------"
        );
    }


    // =========================================================
    // GET COURSES
    // GET /api/courses
    // =========================================================

    private static void getCourses(
            HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (handleOptions(exchange)) {
            return;
        }

        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("GET")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );

            return;
        }

        String query =
                "SELECT course_id, "
                + "course_name, "
                + "trainer_name, "
                + "duration, "
                + "fees "
                + "FROM courses";

        StringBuilder json =
                new StringBuilder("[");

        boolean first = true;

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        connection.prepareStatement(query);

                ResultSet rs =
                        ps.executeQuery()
        ) {

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{")

                        .append("\"id\":")
                        .append(
                                rs.getInt("course_id")
                        )
                        .append(",")

                        .append("\"courseName\":\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "course_name"
                                        )
                                )
                        )
                        .append("\",")

                        .append("\"trainer\":\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "trainer_name"
                                        )
                                )
                        )
                        .append("\",")

                        .append("\"duration\":\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "duration"
                                        )
                                )
                        )
                        .append("\",")

                        .append("\"fees\":")
                        .append(
                                rs.getDouble("fees")
                        )

                        .append("}");

                first = false;
            }

            json.append("]");

            sendResponse(
                    exchange,
                    200,
                    json.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "{"
                    + "\"error\":\""
                    + escape(e.getMessage())
                    + "\""
                    + "}"
            );
        }
    }


    // =========================================================
    // GET VIDEOS BY COURSE
    // GET /api/videos/1
    // =========================================================

    private static void getVideos(
            HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (handleOptions(exchange)) {
            return;
        }

        if (!exchange.getRequestMethod()
                .equalsIgnoreCase("GET")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );

            return;
        }

        String path =
                exchange.getRequestURI().getPath();

        String[] parts =
                path.split("/");

        if (parts.length < 4) {

            sendResponse(
                    exchange,
                    400,
                    "{\"error\":\"Course ID is required\"}"
            );

            return;
        }

        int courseId;

        try {

            courseId =
                    Integer.parseInt(parts[3]);

        } catch (NumberFormatException e) {

            sendResponse(
                    exchange,
                    400,
                    "{\"error\":\"Invalid course ID\"}"
            );

            return;
        }

        String query =
                "SELECT video_id, "
                + "course_id, "
                + "video_title, "
                + "video_url "
                + "FROM videos "
                + "WHERE course_id = ?";

        StringBuilder json =
                new StringBuilder("[");

        boolean first = true;

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        connection.prepareStatement(query)
        ) {

           ps.setInt(1, courseId);

            try (
                    ResultSet rs =
                            ps.executeQuery()
            ) {

                while (rs.next()) {

                    if (!first) {
                        json.append(",");
                    }

                    json.append("{")

                            .append("\"id\":")
                            .append(
                                    rs.getInt(
                                            "video_id"
                                    )
                            )
                            .append(",")

                            .append("\"courseId\":")
                            .append(
                                    rs.getInt(
                                            "course_id"
                                    )
                            )
                            .append(",")

                            .append("\"title\":\"")
                            .append(
                                    escape(
                                            rs.getString(
                                                    "video_title"
                                            )
                                    )
                            )
                            .append("\",")

                            .append("\"url\":\"")
                            .append(
                                    escape(
                                            rs.getString(
                                                    "video_url"
                                            )
                                    )
                            )
                            .append("\"")

                            .append("}");

                    first = false;
                }
            }

            json.append("]");

            sendResponse(
                    exchange,
                    200,
                    json.toString()
            );

        } catch (Exception e) {

            e.printStackTrace();

            sendResponse(
                    exchange,
                    500,
                    "{"
                    + "\"error\":\""
                    + escape(e.getMessage())
                    + "\""
                    + "}"
            );
        }
    }


    // =========================================================
// GET QUESTIONS BY COURSE
// GET /api/questions/1
// =========================================================

private static void getQuestions(
        HttpExchange exchange)
        throws IOException {

    addCorsHeaders(exchange);

    if (handleOptions(exchange)) {
        return;
    }

    if (!exchange.getRequestMethod()
            .equalsIgnoreCase("GET")) {

        sendResponse(
                exchange,
                405,
                "{\"error\":\"Method not allowed\"}"
        );

        return;
    }

    String path =
            exchange.getRequestURI().getPath();

    String[] parts =
            path.split("/");

    if (parts.length < 4) {

        sendResponse(
                exchange,
                400,
                "{\"error\":\"Course ID is required\"}"
        );

        return;
    }

    int courseId;

    try {

        courseId =
                Integer.parseInt(parts[3]);

    } catch (NumberFormatException e) {

        sendResponse(
                exchange,
                400,
                "{\"error\":\"Invalid course ID\"}"
        );

        return;
    }

    String query =
            "SELECT question_id, "
            + "question_text, "
            + "option1, "
            + "option2, "
            + "option3, "
            + "option4, "
            + "correct_answer "
            + "FROM questions "
            + "WHERE course_id = ?";

    StringBuilder json =
            new StringBuilder("[");

    boolean first = true;

    try (
            Connection connection =
                    DBConnection.getConnection();

            PreparedStatement ps =
                    connection.prepareStatement(query)
    ) {

        ps.setInt(1, courseId);

        try (
                ResultSet rs =
                        ps.executeQuery()
        ) {

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{")

                        // ID
                        .append("\"id\":")
                        .append(
                                rs.getInt("question_id")
                        )
                        .append(",")

                        // QUESTION
                        .append("\"question\":\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "question_text"
                                        )
                                )
                        )
                        .append("\",")

                        // OPTIONS
                        .append("\"options\":[")

                        .append("\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "option1"
                                        )
                                )
                        )
                        .append("\",")

                        .append("\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "option2"
                                        )
                                )
                        )
                        .append("\",")

                        .append("\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "option3"
                                        )
                                )
                        )
                        .append("\",")

                        .append("\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "option4"
                                        )
                                )
                        )
                        .append("\"")

                        .append("],")

                        // ANSWER
                        .append("\"answer\":\"")
                        .append(
                                escape(
                                        rs.getString(
                                                "correct_answer"
                                        )
                                )
                        )
                        .append("\"")

                        .append("}");

                first = false;
            }
        }

        json.append("]");

        System.out.println(
                "Questions JSON: " + json
        );

        sendResponse(
                exchange,
                200,
                json.toString()
        );

    } catch (Exception e) {

        e.printStackTrace();

        sendResponse(
                exchange,
                500,
                "{"
                + "\"error\":\""
                + escape(e.getMessage())
                + "\""
                + "}"
        );
    }
}
    // =========================================================
    // HANDLE OPTIONS / CORS PREFLIGHT
    // =========================================================

    private static boolean handleOptions(
            HttpExchange exchange)
            throws IOException {

        if (exchange.getRequestMethod()
                .equalsIgnoreCase("OPTIONS")) {

            exchange.sendResponseHeaders(
                    204,
                    -1
            );

            exchange.close();

            return true;
        }

        return false;
    }


    // =========================================================
    // EXTRACT VALUE FROM SIMPLE JSON
    // =========================================================

    private static String extractValue(
            String json,
            String key) {

        if (json == null || json.isEmpty()) {
            return "";
        }

        String search =
                "\"" + key + "\":";

        int start =
                json.indexOf(search);

        if (start == -1) {
            return "";
        }

        start += search.length();

        // Skip spaces
        while (
                start < json.length()
                        && Character.isWhitespace(
                                json.charAt(start)
                        )
        ) {
            start++;
        }

        // Expect opening quote
        if (
                start >= json.length()
                        || json.charAt(start) != '"'
        ) {
            return "";
        }

        start++;

        StringBuilder value =
                new StringBuilder();

        boolean escaped = false;

        for (
                int i = start;
                i < json.length();
                i++
        ) {

            char c = json.charAt(i);

            if (escaped) {

                if (c == '"' || c == '\\') {
                    value.append(c);
                } else if (c == 'n') {
                    value.append('\n');
                } else if (c == 'r') {
                    value.append('\r');
                } else if (c == 't') {
                    value.append('\t');
                } else {
                    value.append(c);
                }

                escaped = false;

            } else if (c == '\\') {

                escaped = true;

            } else if (c == '"') {

                break;

            } else {

                value.append(c);
            }
        }

        return value.toString().trim();
    }


    // =========================================================
    // CORS HEADERS
    // =========================================================

    private static void addCorsHeaders(
            HttpExchange exchange) {

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, POST, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type, Accept"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Max-Age",
                "86400"
        );

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );
    }


    // =========================================================
    // SEND RESPONSE
    // =========================================================

    private static void sendResponse(
            HttpExchange exchange,
            int statusCode,
            String response)
            throws IOException {

        byte[] bytes =
                response.getBytes(
                        StandardCharsets.UTF_8
                );

        exchange.getResponseHeaders().set(
                "Content-Type",
                "application/json; charset=UTF-8"
        );

        exchange.sendResponseHeaders(
                statusCode,
                bytes.length
        );

        try (
                OutputStream os =
                        exchange.getResponseBody()
        ) {

            os.write(bytes);
            os.flush();
        }

        exchange.close();
    }


    // =========================================================
    // ESCAPE JSON SPECIAL CHARACTERS
    // =========================================================

    private static String escape(
            String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}