const mongoose = require("mongoose");

const TeamSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    members: [
      {
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        role: { type: String, enum: ["Admin", "Team Lead", "Member"], default: "Member" },
      },
    ],
    workspaceName: { type: String, required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Team", TeamSchema);