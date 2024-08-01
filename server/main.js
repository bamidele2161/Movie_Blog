const express = require("express");
const http = require("http");
const app = express();
const dotenv = require("dotenv");
const path = require("path");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const csurf = require("csurf");
const { DatabaseConnection } = require("./config/dbConnection");
const { ErrorHandler } = require("./middleware/errorHandler");
const authRoutes = require("./routes/auth");
const movieRoutes = require("./routes/movie");
const securityRoutes = require("./routes/security");

// Parse incoming request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Load environment variables
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, "./.env") });

// Parse cookies attached to the request
app.use(cookieParser());

// Initialize database connection
DatabaseConnection();

// Configure Cross-Origin Resource Sharing (CORS)
const corsOptions = {
  origin: "http://localhost:5500",
  credentials: true,
  methods: ["PUT,POST,DELETE, OPTIONS"],
  allowedHeaders: ["Content-Type, CSRF-Token"],
};
app.use("*", cors(corsOptions));

// Cross-Site Request Forgery (CSRF) protection middleware
const csrfMiddleware = csurf({ cookie: true });
app.use(csrfMiddleware);

// Route to retrieve CSRF token
app.get("/csrf-token", (req, res) => {
  res.json({ csrfToken: req.csrfToken() });
});

// Routes
app.use("/user", authRoutes);
app.use("/movie", movieRoutes);
app.use("/qr", securityRoutes);

//Error handler
app.use(ErrorHandler);

// Create HTTP server
const server = http.createServer(app);

// Define port number
const port = process.env.PORT || 4000;

// Start listening on the specified port
server.listen(port, () => {
  console.log("Listening on port " + port);
});

// Export the Express app and HTTP server for testing or use in other modules
module.exports = { app, server };
