const express = require("express");
const { signUp, signIn, newOtp, logout, isLoggedIn } = require("../Controllers/Authentication.js");

const auth = express.Router();

auth.post("/signUp", signUp);
auth.get("/isLoggedIn", isLoggedIn);
auth.post("/signIn", signIn);
auth.post("/newOtp", newOtp);
auth.post("/logout", logout);

module.exports = auth;
