const mongoose = require("mongoose");
const User = require("./User");

const applicationSchema = new mongoose.Schema({
    company: {
        type: String, 
        required: true
    },
    role: {
        type: String
    },
    type: {
        type: String, 
        enum: ['Intership', 'Placement'],
        required: true
    },
    status: {
        type: String,
        enum: ['Applied', 'OA', 'Interview', 'Offer', 'Required'],
        default: 'Applied'
    },
    appliedDate: {
        type: Date
    },
    rounds: [
        {
            roundName: {
                type: String
            },
            date: {
                type: Date
            },
            status: {
                type: String,
                enum: ['Scheduled', 'Cleared', 'Rejected', 'Pending'],
                default: 'Pending'
            },
            notes: {
                type: String
            },
            user: {
                type: mongoose.Types.ObjectId,
                ref: 'User',
                required: true
            }
        }
    ]
},
{
    timestamps: true
})

const Application = mongoose.model("Application", applicationSchema);

module.exports = Application;