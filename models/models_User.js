const mongoose = require("mongoose");

const userSchema = mongoose.Schema(
    {
        createdAt: {
            type: Date,
            required: true,
        },
        email: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        lastName: {
            type: String,
            required: true,
        },
        firstName: {
            type: String,
            required: true,
        },
        lastUpVote: {
            type: Date,
            default: () => new Date(Date.now() - 60000),
        },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("User", userSchema);
