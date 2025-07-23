const mongoose = require("mongoose");

const PermissionSchema = new mongoose.Schema({
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
        required: true,
    },
    action: [
        {
            type: String,
            enum: ["create", "read", "update", "delete"],
            required: true,
        },
    ],
});

module.exports = mongoose.model("Permission", PermissionSchema);
