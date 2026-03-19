const mongoose = require("mongoose");

const UiLayerModuleSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },
    title: { type: String, required: true },
    subtitle: { type: String, default: "" },
    bulletOne: { type: String, default: "" },
    bulletTwo: { type: String, default: "" },
    bulletThree: { type: String, default: "" },
    ctaText: { type: String, default: "Explore module" },
    ctaRoute: { type: String, default: "/course" },
    isActive: { type: Boolean, default: true },
    updatedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("UiLayerModule", UiLayerModuleSchema);
