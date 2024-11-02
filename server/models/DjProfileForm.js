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
  profilePicture: {
    type: String,
  },
  // New fields for email verification
  verificationCode: {
    type: String,
  },
  verificationCodeExpiry: {
    type: Date,
  },
  // New field to store Stripe connected account ID
  stripeAccountId: {
    type: String, // Store the connected account ID from Stripe
  },
  // Optional: track if the DJ has completed Stripe onboarding
  isStripeOnboarded: {
    type: Boolean,
    default: false, // Initially false until onboarding is complete
  },
});


// Ensure the unique index is created on the email field
//DjProfileSchema.index({ email: 1 }, { unique: true });

const DjProfile = mongoose.model('DjProfile', DjProfileSchema);

module.exports = DjProfile;
