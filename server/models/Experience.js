const mongoose = require("mongoose");

const experienceSchema = new mongoose.Schema({
    company: {
        type: String,
        required: true
    },
    role: {
        type: String
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard']
    },
    rounds: [
        {
            roundNo: {type: Number},
            roundName: {type: String},
            description: {type: String}
        }
    ],
    offerReceived: {
        type: Boolean,
        default: false
    },
    postedBy: {
        type: mongoose.Types.ObjectId,
        ref: 'User',
        required: true
    }
},
{
    timestamps: true
})

const Experience = mongoose.model("Experience", experienceSchema);

module.exports = Experience;