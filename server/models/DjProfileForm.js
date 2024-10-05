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

// Ensure the unique index is created on the email field
DjProfileSchema.index({ email: 1 }, { unique: true });

const DjProfile = mongoose.model('DjProfile', DjProfileSchema);

module.exports = DjProfile;
