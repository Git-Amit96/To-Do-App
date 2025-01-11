const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
    {
        Name: {
            type: String,
            required: true,
        },
        Email: {
            type: String,
            required: true,
            unique: true,
        },
        Password: {
            type: String,
            required: true,
        },
        isVerified: {
            type: Boolean,
            default: false,
        },
        OTP: {
            type: Number,
            default: undefined,
        },
    },
    {
        timestamps: true,
    }
);

const Profile = mongoose.model("Profile", UserSchema);
Profile.createIndexes({ Email: 1 });

module.exports = Profile;

