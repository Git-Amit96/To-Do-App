const ActivityModel = require("../Models/activity.model");
const TaskModel = require("../Models/task.model");

const addActivity = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { text } = req.body;
        const taskId = req.params.id;

        const isValidId = await TaskModel.findOne({
            _id: taskId.toString(),
            $or: [{ sharedWith: loggedInUser._id },
            { owner: loggedInUser._id }]
        },

        );
        if (!isValidId) {
            return res.status(500).json({ status: "Error", message: "Not such Task exist." });
        }
        const activityObj = new ActivityModel({
            owner: loggedInUser._id,
            task: taskId.toString(),
            text: text.toString(),
        })

        await activityObj.save();
        return res.status(201).json({ status: "Success", message: "Activity added successfully" });

    } catch (err) {
        return res.status(500).json({ status: "Error", message: "Failed to create task", error: err.message });
    }
}

const getActivity = async (req, res) => {
    try {
        const taskId = req.params.id;

        const allActivities = await ActivityModel.find({
            task: taskId.toString(),
        }).sort({createdAt: 1}).select("-task").populate("owner", "Name");

        if(!allActivities){
            return res.status(500).json({ status: "Error", message: "Not such Task exist." });
        }
        return res.status(201).json({ status: "Success", data: allActivities });

    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Failed to get activities", error: err.message });
    }
}

module.exports = { addActivity, getActivity };