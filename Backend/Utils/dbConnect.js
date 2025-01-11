const mongoose = require("mongoose");

const connect = async () => {
    try {
        await mongoose.connect(
            "mongodb+srv://Amit-new-2:Amit9810@cluster1.an5u5.mongodb.net/ToDo-DB?retryWrites=true&w=majority&appName=Cluster1",
        );
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        process.exit(1); 
    }
};

module.exports = connect;
