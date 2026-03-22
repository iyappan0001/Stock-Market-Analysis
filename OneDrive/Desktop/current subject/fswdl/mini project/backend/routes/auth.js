const express = require("express");
const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const User = require("../models/User");
const { protect } = require("../middleware/auth");

const router = express.Router();

// Register
router.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, email, password } = req.body;

    // Validation
    if (!firstName || !lastName || !email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide all required fields" });
    }

    // Ensure MongoDB is connected before querying
    if (mongoose.connection.readyState !== 1) {
      return res
        .status(503)
        .json({ message: "Database not connected. Please try again later." });
    }

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    // Create user
    const user = await User.create({
      firstName,
      lastName,
      email,
      password,
    });

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(201).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: "Email already registered" });
    }

    console.error("Signup error:", error);
    res.status(500).json({ message: "Server error. Please try again." });
  }
});

// Login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      return res
        .status(400)
        .json({ message: "Please provide email and password" });
    }

    // Check for user
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    // Generate token
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "30d",
    });

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get current user
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update watchlist
router.put("/watchlist", protect, async (req, res) => {
  try {
    const { symbol } = req.body;
    const user = await User.findById(req.user.id);

    if (user.watchlist.includes(symbol)) {
      user.watchlist = user.watchlist.filter((s) => s !== symbol);
    } else {
      user.watchlist.push(symbol);
    }

    await user.save();
    res.status(200).json({
      success: true,
      watchlist: user.watchlist,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
