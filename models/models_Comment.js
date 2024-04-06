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

module.exports = mongoose.model("Post", commentSchema);
