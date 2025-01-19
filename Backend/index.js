require('dotenv').config();
const express = require("express");
const connect = require("./Utils/dbConnect.js");
const auth = require("./Routes/auth.router.js");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const task = require("./Routes/task.router.js");
const profile = require("./Routes/profile.router.js");
const activity = require("./Routes/activity.router.js");

const app = express();
const frontndURL = process.env.FRONTEND_URL;
const port = process.env.PORT || 9090;

// Validate environment variables
if (!frontndURL) {
    console.error("❌ FRONTEND_URL is not defined in the environment variables.");
    process.exit(1);
}

app.use(cors({
    origin: frontndURL,
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());

// Route handlers
app.use("/to-do/user", auth);
app.use("/to-do/profile", profile);
app.use("/to-do/activity", activity);
app.use("/to-do", task);

app.get("/", (req, res) => {
    res.send("Welcome to the To-Do App Backend!");
});

// Handle unknown routes
app.use((req, res) => {
    res.status(404).send({ message: "Route not found" });
});

(async () => {
    try {
        await connect();
        console.info("✅ Database connected successfully!");

        const server = app.listen(port, () => {
            console.info(`🚀 Server is running on port ${port}`);
        });

        // Handle server errors
        server.on('error', (error) => {
            if (error.code === 'EADDRINUSE') {
                console.error(`❌ Port ${port} is already in use. Shutting down.`);
                process.exit(1);
            } else {
                console.error("❌ An error occurred:", error);
            }
        });

        // Graceful shutdown on termination signals
        process.on('SIGINT', async () => {
            console.info("🛑 Received SIGINT. Closing server gracefully...");
            server.close(() => {
                console.info("✅ Server closed successfully.");
                process.exit(0);
            });
        });

    } catch (error) {
        console.error("❌ Failed to connect to the database:", error.message);
        process.exit(1);
    }
})();


