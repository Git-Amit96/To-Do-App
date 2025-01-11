const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["pending", "completed"],
    },
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile", 
    },
    sharedWith: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Profile", 
    }]
}, {
    timestamps: true, 
});

TaskSchema.index({ owner: 1 });
TaskSchema.index({ sharedWith: 1 });

const TaskModel = mongoose.model("Task", TaskSchema);
module.exports = TaskModel;
