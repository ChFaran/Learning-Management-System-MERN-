const express = require("express");
const router = express.Router();
const Team = require("../models/Team");
const { protect, authorize } = require("../middleware/authMiddleware");

// Create a new team (Admin or Team Lead)
router.post("/", protect, authorize("Admin", "Team Lead"), async (req, res) => {
  try {
    const { name, description, workspaceName } = req.body;
    const newTeam = await Team.create({
      name,
      description,
      workspaceName,
      creator: req.user._id,
      members: [{ user: req.user._id, role: req.user.role }]
    });
    res.status(201).json(newTeam);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get all teams user belongs to
router.get("/", protect, async (req, res) => {
  try {
    const teams = await Team.find({ "members.user": req.user._id }).populate("members.user", "name email");
    res.json(teams);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add member to team
router.post("/:teamId/members", protect, authorize("Admin", "Team Lead"), async (req, res) => {
  const { userId, role } = req.body;
  try {
    const team = await Team.findById(req.params.teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });
    
    // Check if user already in team
    if (team.members.some(m => m.user.toString() === userId)) {
      return res.status(400).json({ message: "User already in team" });
    }

    team.members.push({ user: userId, role: role || "Member" });
    await team.save();
    res.json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
