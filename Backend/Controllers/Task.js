const Profile = require("../Models/user.model");
const TaskModel = require("../Models/task.model");

const CreateTask = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const { title, status, sharedWith } = req.body;

        if (!title || !status) {
            return res.status(400).json({ status: "Error", message: "Please provide title and status" });
        }
        if (!["pending", "completed"].includes(status.toLowerCase())) {
            return res.status(400).json({ status: "Error", message: "Invalid status" });
        }

        let sharedInfo = [];
        if (sharedWith) {
            if (!Array.isArray(sharedWith)) {
                return res.status(400).json({ status: "Error", message: "sharedWith must be an array" });
            }

            sharedInfo = await Profile.find({ Email: { $in: sharedWith } }).select("_id");
            if (sharedInfo.length !== sharedWith.length) {
                return res.status(400).json({ status: "Error", message: "One or more sharedWith emails are invalid" });
            }
        }

        const TaskData = new TaskModel({
            title,
            status: status.toLowerCase(),
            owner: loggedInUser._id,
            sharedWith: sharedInfo.map(user => user._id),
        });
        await TaskData.save();

        return res.status(201).json({ status: "Success", message: "Task created successfully" });

    } catch (err) {
        return res.status(500).json({ status: "Error", message: "Failed to create task" });
    }
};

const GetTasks = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const allTasks = await TaskModel.find({
            $or: [
                { owner: loggedInUser._id },
                { sharedWith: { $in: [loggedInUser._id] } }
            ]
        }).populate("owner", "Name").populate("sharedWith", "Name");
        if (allTasks.length === 0) {
            res.status(400).json({ success: true, message: "No tasks for you." })
        };
        return res.status(201).json({ success: true, message: "Your Tasks", data: allTasks });

    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Failed to get task" });
    }
};

const UpdateTask = async (req, res) => {
    try {

        const loggedInUser = req.user;
        const taskId = req.params.id;
        const { title, status } = req.body;
        if (!taskId) {
            return res.status(400).json({ status: "Error", message: "Please select task" });
        }
        const getTask = await TaskModel.findOne({ _id: taskId, owner: loggedInUser._id });
        if (!getTask) {
            return res.status(400).json({ status: "Error", message: "Task not found or you are not authorized to update it" });
        };

        if (title) getTask.title = title;
        if (status) {
            if (!["pending", "completed"].includes(status.toLowerCase())) {
                return res.status(400).json({ status: "Error", message: "Invalid status" });
            }
            getTask.status = status.toLowerCase();
        }
        await getTask.save();

        return res.status(201).json({ success: true, message: "Task updated successfully", data: getTask });
    } catch (error) {
        return res.status(500).json({ status: "Error", message: "Updation Failed" });
    }

}

const DeleteTask = async (req, res) => {
    try {
        const loggedInUser = req.user;
        const taskId = req.params.id;

        const deletedTask = await TaskModel.findOneAndDelete({
            _id: taskId,
            owner: loggedInUser._id
        });

        if (!deletedTask) {
            return res.status(404).json({ success: false, message: "Task not found or you are not authorized to delete it" });
        }

        return res.status(200).json({ success: true, message: "Task deleted successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "An error occurred while deleting the task" });
    }
};


module.exports = { CreateTask, GetTasks, UpdateTask, DeleteTask };

