const mongoose = require('mongoose');

const DjProfileSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  bio: {
    type: String,
    required: true,
  },
  link: {
    type: String,
    required: true,
  },
  // Add any additional fields you need
});

const DjProfile = mongoose.model('DjProfile', DjProfileSchema);

module.exports = DjProfile;
