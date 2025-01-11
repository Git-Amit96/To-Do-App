const express = require("express");
const { addActivity, getActivity } = require("../Controllers/Activities");
const isSignIn = require("../Middlewares/isSignIn");

const activity = express.Router();

activity.post("/add/:id", isSignIn, addActivity);
activity.post("/get/:id", isSignIn, getActivity);
module.exports = activity;