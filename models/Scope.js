const mongoose = require("mongoose");

const ScopeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },

    resource: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Resource",
      required: true,
    },

    actions: [
      {
        type: String,
        enum: ["create", "read", "update", "delete"],
      },
    ],
  },
  { timestamps: true },
);

module.exports = mongoose.model("Scope", ScopeSchema);
