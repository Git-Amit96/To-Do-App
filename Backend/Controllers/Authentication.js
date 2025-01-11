const bcrypt = require("bcrypt");
const Profile = require("../Models/user.model.js");
const isValid = require("../Middlewares/Validate.js");
const jwt = require('jsonwebtoken');


const signUp = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ status: "Failed", message: "All fields are mandatory" });
        }

        const isPerfect = isValid({ email, password });
        if (!isPerfect) {
            return res.status(400).json({ status: "Error", message: "Password or Email is not strong or valid" });
        }

        const isPresent = await Profile.findOne({ Email: email });
        if (isPresent) {
            return res.status(400).json({ status: "Error", message: "User already registered. Please Sign In." });
        }

        const hashPassword = await bcrypt.hash(password, 10);
        const otp = (Math.floor(Math.random() * 900000) + 100000).toString();

        const user = new Profile({
            Name: name,
            Email: email,
            Password: hashPassword,
            OTP: otp,
        });
        await user.save();

        return res.status(201).json({
            status: "Success",
            message: "User Registered Successfully. Now SignIn.",
            OTP: otp,
        });
    } catch (err) {
        res.status(500).json({ status: "Failed", message: "SignUp Failed. Please Try Again" });
    }
};

const signIn = async (req, res) => {
    try {
        const { email, password, otp } = req.body;
        if (!email || !password) {
            throw new Error("All fields are mandatory");
        }
        const isPresent = await Profile.findOne({ Email: email });
        if (!isPresent) {
            return res.status(400).json({ status: "Error", message: "User not found. Please Sign Up." });
        } 
        
        const passwordCheck= await bcrypt.compare(password, isPresent.Password);
        if(!passwordCheck){
            return res.status(400).json({ status: "Error", message: "Password is not correct" });

        } 
        const token = jwt.sign({ id: isPresent._id }, "Auth@12345", { expiresIn: "7d" });
        if (isPresent.isVerified) {

            res.cookie("Token", token);
            return res.status(201).json({
                status: "Success",
                message: "Login Successful",
                
            });
        }
        const fifteenMinutes = 15 * 60 * 1000;
        if (Date.now() - new Date(isPresent.updatedAt).getTime() > fifteenMinutes) {
            return res.status(400).json({ status: "Error", message: "OTP Expired. Please generate new OTP" });
        }
        if (isPresent.OTP != otp) {
            return res.status(400).json({ status: "Error", message: "Invalid OTP" });
        }

        isPresent.OTP = undefined;
        isPresent.isVerified = true;
        await isPresent.save();
        res.cookie("Token", token);
        return res.status(201).json({
            status: "Success",
            message: "Login Successful",

        });

    } catch (err) {
        res.status(500).json({ status: "Failed", message: "Login Failed. Please Try Again" });
    }
}

const logout = (req, res) => {
    res.cookie("Token", null, {
        expires: new Date(Date.now())
    })
    res.send("Logged out successful!");
};

const newOtp = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ status: "Error", message: "Please provide email to verify." });
        }
        const user = await Profile.findOne({ Email: email });
        if (!user) {
            return res.status(400).json({ status: "Error", message: "User not found. Please Sign Up." });
        }

        if (user.isVerified) {
            return res.status(201).json({
                status: "Success",
                message: "Already Verified. No need for OTP. SignIn without OTP",
                
            });
        }

        const otp = (Math.floor(Math.random() * 900000) + 100000).toString();
        user.OTP = otp;
        await user.save();
        return res.status(201).json({
            status: "Success",
            message: "OTP generated successfully. Now SignIn!",
            OTP: otp,

        });
    }
    catch (err) {
        res.status(500).json({ status: "Failed", message: "Please Try Again" });
    }
};


module.exports = {signUp, signIn, logout, newOtp};