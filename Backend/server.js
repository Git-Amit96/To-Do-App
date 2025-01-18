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
const port= process.env.PORT;


app.use(cors({
    origin: frontndURL, // Set the exact frontend URL
    methods: ['GET', 'POST', 'PATCH', 'DELETE', 'PUT'],
    credentials: true, // Allow credentials (cookies, authorization headers, etc.)
    allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(cookieParser());
app.use(express.json());

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

