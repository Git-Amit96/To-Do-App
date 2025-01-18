const mongoose = require("mongoose");

const connect = async () => {
    const mongodbURI= process.env.MONGODB_CONNECTION_URL;
    try {
        await mongoose.connect(
            mongodbURI
        );
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); 
    }
};

module.exports = connect;
