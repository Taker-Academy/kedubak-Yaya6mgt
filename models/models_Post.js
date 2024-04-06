const mongoose = require("mongoose");

const commentSchema = mongoose.Schema(
    {
        createdAt: {
            type: Date,
            default: Date.now
        },
        id: {
            type: String,
            required: true
        },
        firstName: {
            type: String,
            required: true
        },
        content: {
            type: String,
            required: true
        },
    }
)

const userSchema = mongoose.Schema(
    {
        createdAt: {
            type: Date,
            required: true,
        },
        userId: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        title: {
            type: String,
            required: true,
        },
        content: {
            type: String,
            required: true,
        },
        comments: {
        type: [commentSchema],
        default: []
        },
        upVotes: {
            type: [String],
            default: [],
            required: true
        }
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Post", userSchema);