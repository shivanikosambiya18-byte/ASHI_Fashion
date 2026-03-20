const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// ========== REGISTER ==========
router.post('/register', async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    if (!fullName || !email || !password)
      return res.status(400).json({ success: false, message: 'All fields are required' });
    if (password.length < 6)
      return res.status(400).json({ success: false, message: 'Password must be at least 6 characters' });
    const existingUser = await User.findOne({ email });
    if (existingUser)
      return res.status(400).json({ success: false, message: 'Email already registered. Please login.' });
    const user = new User({ fullName, email, password });
    await user.save();
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(201).json({ success: true, message: 'Account created successfully!', token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

// ========== LOGIN ==========
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    const user = await User.findOne({ email });
    if (!user)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const isMatch = await user.comparePassword(password);
    if (!isMatch)
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    const token = jwt.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: '7d' });
    res.status(200).json({ success: true, message: 'Login successful!', token, user: { id: user._id, fullName: user.fullName, email: user.email } });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
});

module.exports = router;