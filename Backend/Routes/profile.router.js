const express = require("express");
const isSignIn = require("../Middlewares/isSignIn.js");
const { View } = require("../Controllers/Profile.js");

const profile = express.Router();

profile.get("/view", isSignIn, View);

module.exports = profile;
