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
  email: {
    type: String,
    required: true,
    unique: true,
    match: /.+\@.+\..+/
  },
  // Add any additional fields you need
});

const DjProfile = mongoose.model('DjProfile', DjProfileSchema);

module.exports = DjProfile;
