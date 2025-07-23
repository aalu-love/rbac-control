const mongoose = require("mongoose");

const ResourceSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }, // e.g., "User", "Post", "Comment"
});

module.exports = mongoose.model("Resource", ResourceSchema);
