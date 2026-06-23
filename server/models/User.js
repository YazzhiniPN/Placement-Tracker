const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    username: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    branch: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        enum: [1,2,3,4],
        required: true
    },
    refreshToken: {
        type: String
    }
},
{
    timestamps: true
});

const User = mongoose.model("User", userSchema);

module.exports = User;