const mongoose = require("mongoose");

const ScopeSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "rw_post", "r_post"
    resource: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Resource",
        required: true,
    },
    actions: [{ type: String, enum: ["create", "read", "write", "delete"] }], // e.g., ["read", "write"]
});

module.exports = mongoose.model("Scope", ScopeSchema);
