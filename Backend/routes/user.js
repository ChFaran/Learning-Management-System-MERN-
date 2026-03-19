const express = require("express");
const User = require("../models/User");
const Course = require("../models/Course");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate({
        path: "enrolledCourses.course",
        select: "title description price thumbnail isPublished",
      })
      .select("-password");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/me", protect, async (req, res) => {
  try {
    const allowed = ["name", "avatar", "headline", "bio", "country"];
    const user = await User.findById(req.user._id);

    allowed.forEach((field) => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updated = await user.save();
    res.json({
      _id: updated._id,
      name: updated.name,
      email: updated.email,
      role: updated.role,
      avatar: updated.avatar,
      headline: updated.headline,
      bio: updated.bio,
      country: updated.country,
      hasPaymentDetails: updated.hasPaymentDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.put("/me/payment-details", protect, async (req, res) => {
  try {
    const { accountHolder, bankName, accountNumber, billingAddress } = req.body;

    if (!accountHolder || !bankName || !accountNumber || !billingAddress) {
      return res.status(400).json({ message: "Complete bank details are required" });
    }

    const user = await User.findById(req.user._id);
    user.paymentDetails = {
      accountHolder,
      bankName,
      accountNumberLast4: String(accountNumber).slice(-4),
      billingAddress,
    };
    user.hasPaymentDetails = true;

    await user.save();
    res.json({ message: "Payment details saved", hasPaymentDetails: true });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/me/enroll/:courseId", protect, async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);
    if (!course) return res.status(404).json({ message: "Course not found" });

    const user = await User.findById(req.user._id);
    const alreadyEnrolled = user.enrolledCourses.some(
      (entry) => String(entry.course) === String(course._id)
    );

    if (alreadyEnrolled) {
      return res.json({ message: "Already enrolled" });
    }

    if (course.price > 0 && !user.hasPaymentDetails) {
      return res.status(400).json({
        message: "Payment details are required for paid courses",
      });
    }

    user.enrolledCourses.push({ course: course._id, progress: 0 });
    if (user.role === "Guest") {
      user.role = "Registered";
    }

    await user.save();
    res.status(201).json({ message: "Enrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/me/enroll/:courseId", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.enrolledCourses = user.enrolledCourses.filter(
      (entry) => String(entry.course) !== String(req.params.courseId)
    );
    await user.save();

    res.json({ message: "Unenrolled successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin/users", protect, authorize("Admin"), async (req, res) => {
  try {
    const users = await User.find().select("-password").sort({ createdAt: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/admin/users/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.delete("/admin/users/:id", protect, authorize("Admin"), async (req, res) => {
  try {
    if (String(req.user._id) === String(req.params.id)) {
      return res.status(400).json({ message: "Cannot delete your own admin account" });
    }

    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: "User not found" });

    res.json({ message: "User removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/admin/users/:id/make-admin", protect, authorize("Admin"), async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    user.role = "Admin";
    await user.save();

    res.json({ message: "User promoted to admin" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
