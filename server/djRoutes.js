const express = require('express');
const DjProfile = require('./models/DjProfileForm'); // Update path accordingly
const router = express.Router();

// Create a DJ profile
router.post('/djs', async (req, res) => {
  const { name, bio, link } = req.body;

  try {
    const newDj = new DjProfile({ name, bio, link });
    await newDj.save();

    console.log('DJ Profile Created:', { name, bio, link });
    res.status(201).json({ success: true, message: 'DJ profile created!' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// You can also add other routes to get, update, or delete DJ profiles

module.exports = router;
