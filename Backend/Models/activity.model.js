const mongoose = require("mongoose");

const ActivitySchema = new mongoose.Schema({
    owner: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "Profile",
    },
    task:{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: "TaskModel"
    },
    text: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

ActivitySchema.index({ task: 1 });

const ActivityModel = mongoose.model("ActivityModel", ActivitySchema);
module.exports = ActivityModel;