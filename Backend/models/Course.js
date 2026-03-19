const mongoose = require("mongoose");

const LessonSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String }, // Markdown or HTML
  videoUrl: { type: String },
  isInteractive: { type: Boolean, default: false }, // For coding environment
  order: { type: Number, required: true }
});

const ModuleSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  lessons: [LessonSchema],
  order: { type: Number, required: true }
});

const CourseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, required: true },
    thumbnail: { type: String },
    price: { type: Number, default: 0 }, // 0 = free
    modules: [ModuleSchema],
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    isPublished: { type: Boolean, default: false }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Course", CourseSchema);