const express = require('express');
const router = express.Router();

// A placeholder database object
const djs = [];

// Create a DJ profile
router.post('/djs', (req, res) => {
  const { name, bio, link } = req.body;



  // Add DJ profile to the "database"
  djs.push({ name, bio, link });

  // Respond with success
  res.status(201).json({ success: true, message: 'DJ profile created!' });
});

module.exports = router;
