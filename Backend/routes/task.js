const express = require("express");
const router = express.Router();
const Task = require("../models/Task");
const { protect } = require("../middleware/authMiddleware");

// Create Task
router.post("/", protect, async (req, res) => {
  try {
    const { title, description, projectId, assigneeId, priority, dueDate } = req.body;
    const task = await Task.create({
      title,
      description,
      project: projectId,
      assignee: assigneeId,
      priority,
      dueDate
    });
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Tasks by Project
router.get("/project/:projectId", protect, async (req, res) => {
  try {
    const tasks = await Task.find({ project: req.params.projectId }).populate("assignee", "name");
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update Task Status
router.put("/:taskId/status", protect, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findByIdAndUpdate(req.params.taskId, { status }, { new: true });
    res.json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
