const express = require("express");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/User");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || "supersecret", { expiresIn: "30d" });
};

router.post("/register", async (req, res) => {
  const { name, email, password, role } = req.body;
  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!normalizedEmail || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      if (userExists.role === "Admin") {
        return res.status(400).json({ message: "Admin account already exists for this email" });
      }

      userExists.name = name || userExists.name;
      userExists.password = password;
      userExists.authProvider = "local";
      userExists.oauthId = null;
      if (userExists.role === "Guest") {
        userExists.role = "Registered";
      }
      await userExists.save();

      return res.json({
        _id: userExists._id,
        name: userExists.name,
        email: userExists.email,
        role: userExists.role,
        token: generateToken(userExists._id),
      });
    }

    // Prevent self-assigning admin on public registration.
    const safeRole = role === "Admin" ? "Registered" : (role || "Registered");

    const user = await User.create({
      name,
      email: normalizedEmail,
      password,
      role: safeRole,
      authProvider: "local"
    });
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/oauth/continue", async (req, res) => {
  const { provider, name, email } = req.body;
  const normalizedProvider = ["google", "facebook", "x"].includes(provider) ? provider : null;
  const normalizedEmail = String(email || "").trim().toLowerCase();

  if (!normalizedProvider) {
    return res.status(400).json({ message: "Unsupported provider" });
  }

  if (!normalizedEmail || !name) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    let user = await User.findOne({ email: normalizedEmail });

    if (!user) {
      user = await User.create({
        name,
        email: normalizedEmail,
        password: crypto.randomBytes(16).toString("hex"),
        authProvider: normalizedProvider,
        oauthId: `${normalizedProvider}_${crypto.randomBytes(6).toString("hex")}`,
        role: "Registered"
      });
    }

    if (user.role === "Guest") {
      user.role = "Registered";
      await user.save();
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id),
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const user = await User.findOne({ email: normalizedEmail });
    if (user && !user.password) {
      return res.status(401).json({ message: "No password set for this account. Use continue with provider or register again." });
    }
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        token: generateToken(user._id),
      });
    } else {
      res.status(401).json({ message: "Invalid email or password" });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/me", protect, async (req, res) => {
  res.json(req.user);
});

module.exports = router;
