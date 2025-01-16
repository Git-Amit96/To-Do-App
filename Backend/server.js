const express = require("express");
const connect = require("./Utils/dbConnect.js");
const auth = require("./Routes/auth.router.js");
const cookieParser = require('cookie-parser');
const cors = require("cors");
const task = require("./Routes/task.router.js");
const profile = require("./Routes/profile.router.js");
const activity = require("./Routes/activity.router.js");
require('dotenv').config();

const app = express();
app.use(cors({
    origin: 'http://localhost:5173', // Set the exact frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());

const port = 5000;


app.use("/to-do/user", auth);
app.use("/to-do/profile", profile);
app.use("/to-do/activity", activity);
app.use("/to-do", task);

(async () => {
    try {
        await connect();
        console.log("Database connected successfully!");

        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    } catch (error) {
        console.error("Failed to connect to the database:", error.message);
        process.exit(1);
    }
})();

