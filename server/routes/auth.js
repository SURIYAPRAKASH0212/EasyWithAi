const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../database');
const auth = require('../middleware/auth');

const JWT_SECRET = process.env.JWT_SECRET || 'super_secret_easy_with_ai_token_key_123';

// POST /register
router.post('/register', async (req, res) => {
  const { username, email, password, fullName } = req.body;

  if (!username || !email || !password || !fullName) {
    return res.status(400).json({ message: 'All fields (username, email, password, fullName) are required.' });
  }

  try {
    // Check if username or email already exists
    const existingUser = await db.get('SELECT id FROM users WHERE username = ? OR email = ?', [username, email]);
    if (existingUser) {
      return res.status(400).json({ message: 'Username or email already registered.' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Insert user
    const result = await db.run(
      'INSERT INTO users (username, email, password, fullName, phone, location) VALUES (?, ?, ?, ?, ?, ?)',
      [username, email, hashedPassword, fullName, '', '']
    );

    const user = { id: result.id, username, email, fullName, phone: '', location: '' };

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error during registration.' });
  }
});

// POST /login
router.post('/login', async (req, res) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return res.status(400).json({ message: 'Username/email and password are required.' });
  }

  try {
    // Find user
    const user = await db.get('SELECT * FROM users WHERE username = ? OR email = ?', [username, username]);
    if (!user) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid username/email or password.' });
    }

    const userData = {
      id: user.id,
      username: user.username,
      email: user.email,
      fullName: user.fullName,
      phone: user.phone || '',
      location: user.location || ''
    };

    // Generate JWT token
    const token = jwt.sign({ id: user.id, username: user.username }, JWT_SECRET, { expiresIn: '7d' });

    res.json({
      message: 'Login successful',
      token,
      user: userData
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Internal server error during login.' });
  }
});

// GET /me
router.get('/me', auth, async (req, res) => {
  try {
    const user = await db.get('SELECT id, username, email, fullName, phone, location FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }
    res.json({ user });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving user data.' });
  }
});

// PUT /profile
router.put('/profile', auth, async (req, res) => {
  const { fullName, email, phone, location } = req.body;

  if (!fullName || !email) {
    return res.status(400).json({ message: 'Full name and email are required.' });
  }

  try {
    // Check if email is already taken by another user
    const emailConflict = await db.get('SELECT id FROM users WHERE email = ? AND id != ?', [email, req.user.id]);
    if (emailConflict) {
      return res.status(400).json({ message: 'Email address is already in use by another account.' });
    }

    // Update profile
    await db.run(
      'UPDATE users SET fullName = ?, email = ?, phone = ?, location = ? WHERE id = ?',
      [fullName, email, phone || '', location || '', req.user.id]
    );

    const updatedUser = await db.get('SELECT id, username, email, fullName, phone, location FROM users WHERE id = ?', [req.user.id]);

    res.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error updating profile details.' });
  }
});

// POST /change-password
router.post('/change-password', auth, async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  if (!oldPassword || !newPassword) {
    return res.status(400).json({ message: 'Old password and new password are required.' });
  }

  try {
    // Get user password
    const user = await db.get('SELECT password FROM users WHERE id = ?', [req.user.id]);
    if (!user) {
      return res.status(404).json({ message: 'User not found.' });
    }

    // Verify old password
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Incorrect current password.' });
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    // Update password
    await db.run('UPDATE users SET password = ? WHERE id = ?', [hashedNewPassword, req.user.id]);

    res.json({ message: 'Password updated successfully.' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error changing password.' });
  }
});

module.exports = router;
