const express = require("express");
const bcrypt = require("bcryptjs");
const User = require("../models/User");
const protect = require("../middleware/authMiddleware");
const generateToken = require("../utils/generateTokens");

const router = express.Router();

router.post("/signup", async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const user = await User.create({
      username,
      email,
      passwordHash
    });

    const token = generateToken(user._id);

res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production (HTTPS)
  sameSite: "lax"
});

res.status(201).json({
  _id: user._id,
  username: user.username,
  email: user.email
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);

    if (!isMatch) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

res.cookie("token", token, {
  httpOnly: true,
  secure: false, // true in production
  sameSite: "lax"
});

res.json({
  _id: user._id,
  username: user.username,
  email: user.email
});

  } catch (err) {
    res.status(500).json({ message: err.message });
  }

});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

//api/auth/me
router.get("/me", protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select("-passwordHash");

    if(!user){
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);

  }

  catch (err) {
    res.status(500).json({ message: err.message });
  }
} );


module.exports = router;