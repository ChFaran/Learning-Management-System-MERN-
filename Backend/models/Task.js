const mongoose = require("mongoose");

const TaskSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String },
    project: { type: mongoose.Schema.Types.ObjectId, ref: "Project", required: true },
    assignee: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    priority: { type: String, enum: ["Low", "Medium", "High"], default: "Medium" },
    status: { type: String, enum: ["To Do", "In Progress", "Completed"], default: "To Do" },
    dueDate: { type: Date, required: true },
    subtasks: [
      {
        title: String,
        isCompleted: { type: Boolean, default: false }
      }
    ],
    attachments: [{ type: String }], // Optional URLs
  },
  { timestamps: true }
);

module.exports = mongoose.model("Task", TaskSchema);