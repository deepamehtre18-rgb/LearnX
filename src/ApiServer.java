import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpServer;
import db.DBConnection;
import java.io.IOException;
import java.io.OutputStream;
import java.net.InetSocketAddress;
import java.nio.charset.StandardCharsets;
import java.sql.Connection;
import java.sql.PreparedStatement;
import java.sql.ResultSet;

public class ApiServer {

    public static void main(String[] args) throws Exception {

        // Render provides the PORT environment variable
        int port = Integer.parseInt(
                System.getenv().getOrDefault("PORT", "8080")
        );

        HttpServer server = HttpServer.create(
                new InetSocketAddress(port), 0
        );

        // Root endpoint
        server.createContext("/", ApiServer::home);

        // API endpoints
        server.createContext("/api/courses", ApiServer::getCourses);
        server.createContext("/api/questions", ApiServer::getQuestions);
        server.createContext("/api/videos", ApiServer::getVideos);

        server.start();

        System.out.println("=================================");
        System.out.println("LearnX API Server Started");
        System.out.println("Running on port: " + port);
        System.out.println("=================================");
    }


    // =========================================================
    // HOME / HEALTH CHECK
    // URL: http://localhost:8080/
    // =========================================================

    private static void home(HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );
            return;
        }

        String response =
                "{\"message\":\"LearnX API Server is running\"}";

        sendResponse(exchange, 200, response);
    }


    // =========================================================
    // GET COURSES
    // URL: /api/courses
    // =========================================================

    private static void getCourses(HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            exchange.sendResponseHeaders(405, -1);
            return;
        }

        String query =
                "SELECT course_id, course_name, trainer_name, duration, fees " +
                "FROM courses";

        StringBuilder json = new StringBuilder("[");
        boolean first = true;

        try (
                Connection connection = DBConnection.getConnection();
                PreparedStatement ps = connection.prepareStatement(query);
                ResultSet rs = ps.executeQuery()
        ) {

            while (rs.next()) {

                if (!first) {
                    json.append(",");
                }

                json.append("{")
                        .append("\"id\":")
                        .append(rs.getInt("course_id"))
                        .append(",")

                        .append("\"courseName\":\"")
                        .append(escape(rs.getString("course_name")))
                        .append("\",")

                        .append("\"trainer\":\"")
                        .append(escape(rs.getString("trainer_name")))
                        .append("\",")

                        .append("\"duration\":\"")
                        .append(escape(rs.getString("duration")))
                        .append("\",")

                        .append("\"fees\":")
                        .append(rs.getDouble("fees"))

                        .append("}");

                first = false;
            }

            json.append("]");

            sendResponse(exchange, 200, json.toString());

        } catch (Exception e) {

            e.printStackTrace();

            String error =
                    "{\"error\":\"" +
                    escape(e.getMessage()) +
                    "\"}";

            sendResponse(exchange, 500, error);
        }
    }


    // =========================================================
    // GET VIDEOS BY COURSE
    // URL: /api/videos/1
    // =========================================================

    private static void getVideos(HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );
            return;
        }

        String path = exchange.getRequestURI().getPath();

        String[] parts = path.split("/");

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

            courseId = Integer.parseInt(parts[3]);

        } catch (NumberFormatException e) {

            sendResponse(
                    exchange,
                    400,
                    "{\"error\":\"Invalid course ID\"}"
            );

            return;
        }

        String query = """
                SELECT video_id,
                       course_id,
                       video_title,
                       video_url
                FROM videos
                WHERE course_id = ?
                """;

        StringBuilder json = new StringBuilder("[");
        boolean first = true;

        try (
                Connection connection = DBConnection.getConnection();
                PreparedStatement ps =
                        connection.prepareStatement(query)
        ) {

            ps.setInt(1, courseId);

            try (ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    if (!first) {
                        json.append(",");
                    }

                    json.append("{")

                            .append("\"id\":")
                            .append(rs.getInt("video_id"))
                            .append(",")

                            .append("\"courseId\":")
                            .append(rs.getInt("course_id"))
                            .append(",")

                            .append("\"title\":\"")
                            .append(
                                    escape(
                                            rs.getString("video_title")
                                    )
                            )
                            .append("\",")

                            .append("\"url\":\"")
                            .append(
                                    escape(
                                            rs.getString("video_url")
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

            String error =
                    "{\"error\":\"" +
                    escape(e.getMessage()) +
                    "\"}";

            sendResponse(
                    exchange,
                    500,
                    error
            );
        }
    }


    // =========================================================
    // GET QUESTIONS BY COURSE
    // URL: /api/questions/1
    // =========================================================

    private static void getQuestions(HttpExchange exchange)
            throws IOException {

        addCorsHeaders(exchange);

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {

            sendResponse(
                    exchange,
                    405,
                    "{\"error\":\"Method not allowed\"}"
            );

            return;
        }

        String path = exchange.getRequestURI().getPath();

        String[] parts = path.split("/");

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

            courseId = Integer.parseInt(parts[3]);

        } catch (NumberFormatException e) {

            sendResponse(
                    exchange,
                    400,
                    "{\"error\":\"Invalid course ID\"}"
            );

            return;
        }


        // =====================================================
        // DATABASE QUERY
        // =====================================================

        String query = """
                SELECT question_id,
                       question_text,
                       option1,
                       option2,
                       option3,
                       option4,
                       correct_answer
                FROM questions
                WHERE course_id = ?
                """;

        StringBuilder json = new StringBuilder("[");
        boolean first = true;

        try (
                Connection connection =
                        DBConnection.getConnection();

                PreparedStatement ps =
                        connection.prepareStatement(query)
        ) {

            ps.setInt(1, courseId);

            try (ResultSet rs = ps.executeQuery()) {

                while (rs.next()) {

                    if (!first) {
                        json.append(",");
                    }

                    json.append("{")

                            .append("\"id\":")
                            .append(rs.getInt("question_id"))
                            .append(",")

                            .append("\"question\":\"")
                            .append(
                                    escape(
                                            rs.getString("question_text")
                                    )
                            )
                            .append("\",")

                            .append("\"options\":[")

                            .append("\"")
                            .append(
                                    escape(
                                            rs.getString("option1")
                                    )
                            )
                            .append("\",")

                            .append("\"")
                            .append(
                                    escape(
                                            rs.getString("option2")
                                    )
                            )
                            .append("\",")

                            .append("\"")
                            .append(
                                    escape(
                                            rs.getString("option3")
                                    )
                            )
                            .append("\",")

                            .append("\"")
                            .append(
                                    escape(
                                            rs.getString("option4")
                                    )
                            )
                            .append("\"")

                            .append("],")

                            .append("\"answer\":\"")
                            .append(
                                    escape(
                                            rs.getString("correct_answer")
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

            String error =
                    "{\"error\":\"" +
                    escape(e.getMessage()) +
                    "\"}";

            sendResponse(
                    exchange,
                    500,
                    error
            );
        }
    }


    // =========================================================
    // CORS HEADERS
    // =========================================================

    private static void addCorsHeaders(
            HttpExchange exchange
    ) {

        // Allow deployed frontend + local frontend
        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Origin",
                "*"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Methods",
                "GET, OPTIONS"
        );

        exchange.getResponseHeaders().set(
                "Access-Control-Allow-Headers",
                "Content-Type"
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
            String response
    ) throws IOException {

        byte[] bytes =
                response.getBytes(StandardCharsets.UTF_8);

        exchange.sendResponseHeaders(
                statusCode,
                bytes.length
        );

        try (OutputStream os =
                     exchange.getResponseBody()) {

            os.write(bytes);
        }
    }


    // =========================================================
    // ESCAPE JSON SPECIAL CHARACTERS
    // =========================================================

    private static String escape(String value) {

        if (value == null) {
            return "";
        }

        return value
                .replace("\\", "\\\\")
                .replace("\"", "\\\"");
    }
}