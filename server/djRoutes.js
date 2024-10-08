const express = require('express');
const DjProfile = require('./models/DjProfileForm'); // Update path accordingly
const router = express.Router();

// Create a DJ profile
router.post('/djs', async (req, res) => {
  const { name, bio, email } = req.body;

  try {
    const newDj = new DjProfile({ name, bio, email });
    await newDj.save();

    console.log('DJ Profile Created:', { name, bio, email });
    res.status(201).json({ success: true, message: 'DJ profile created!' });
  } catch (error) {

    if (error.code === 11000 && error.keyValue.email) {
      // Return a 400 Bad Request status with the appropriate error message
      return res.status(400).json({ error: 'Email already exists. Please use a different email.' });
    }

    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// You can also add other routes to get, update, or delete DJ profiles

module.exports = router;
