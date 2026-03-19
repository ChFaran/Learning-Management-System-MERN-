const express = require("express");
const UiLayerModule = require("../models/UiLayerModule");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

const defaultModuleData = {
  key: "main-ui-layer",
  title: "Build and Deploy Your Own LLM-powered App",
  subtitle: "Single focused module in the main UI with isolated animation layer.",
  bulletOne: "Solve guided tasks",
  bulletTwo: "Build with AI tools",
  bulletThree: "Ship portfolio project",
  ctaText: "Open learning module",
  ctaRoute: "/course",
  isActive: true,
};

router.get("/main-layer", async (req, res) => {
  try {
    let moduleDoc = await UiLayerModule.findOne({ key: "main-ui-layer" });

    if (!moduleDoc) {
      moduleDoc = await UiLayerModule.create(defaultModuleData);
    }

    res.json(moduleDoc);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/main-layer", protect, authorize("Admin"), async (req, res) => {
  try {
    const payload = {
      title: req.body.title,
      subtitle: req.body.subtitle,
      bulletOne: req.body.bulletOne,
      bulletTwo: req.body.bulletTwo,
      bulletThree: req.body.bulletThree,
      ctaText: req.body.ctaText,
      ctaRoute: req.body.ctaRoute,
      isActive: req.body.isActive,
      updatedBy: req.user._id,
    };

    Object.keys(payload).forEach((k) => payload[k] === undefined && delete payload[k]);

    const updated = await UiLayerModule.findOneAndUpdate(
      { key: "main-ui-layer" },
      { $set: payload, $setOnInsert: { ...defaultModuleData } },
      { new: true, upsert: true }
    );

    res.json(updated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = router;
