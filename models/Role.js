const mongoose = require("mongoose");

const RoleSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // e.g., "admin", "editor", "viewer"
    scopes: [{ type: mongoose.Schema.Types.ObjectId, ref: "Scope" }], // Scopes associated with this role
  },
  { timestamps: true },
);

module.exports = mongoose.model("Role", RoleSchema);
