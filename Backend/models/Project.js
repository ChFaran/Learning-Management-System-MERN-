const mongoose = require("mongoose");

const ProjectSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    team: { type: mongoose.Schema.Types.ObjectId, ref: "Team", required: true },
    deadline: { type: Date, required: true },
    status: { type: String, enum: ["Active", "Archived", "Completed"], default: "Active" },
    manager: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Project", ProjectSchema);