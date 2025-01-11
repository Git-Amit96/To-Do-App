const express = require("express");
const { CreateTask, GetTasks, UpdateTask, DeleteTask } = require("../Controllers/Task.js");
const isSignIn = require("../Middlewares/isSignIn.js");

const task = express.Router();

task.post("/tasks/create", isSignIn, CreateTask);
task.get("/tasks/get", isSignIn, GetTasks);
task.put("/tasks/update/:id", isSignIn, UpdateTask);
task.delete("/tasks/delete/:id", isSignIn, DeleteTask);

module.exports = task;

