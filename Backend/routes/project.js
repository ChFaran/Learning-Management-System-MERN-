const express = require("express");
const router = express.Router();
const Project = require("../models/Project");
const { protect, authorize } = require("../middleware/authMiddleware");

// Create Project in a team
router.post("/", protect, authorize("Admin", "Team Lead"), async (req, res) => {
  try {
    const { title, description, teamId, deadline } = req.body;
    const project = await Project.create({
      title,
      description,
      team: teamId,
      deadline,
      manager: req.user._id
    });
    res.status(201).json(project);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get Projects by Team
router.get("/team/:teamId", protect, async (req, res) => {
  try {
    const projects = await Project.find({ team: req.params.teamId }).populate("manager", "name");
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
