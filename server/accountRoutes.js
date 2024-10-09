const express = require('express');
const router = express.Router();
const authenticateToken = require('./authMiddleware');
const DjProfile = require('./models/DjProfileForm'); // Adjust the path as needed

router.get('/', authenticateToken, async (req, res) => {
    try {
        // Fetch the user data from the database using the userId from the token
        const user = await DjProfile.findById(req.user.userId);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Send user details back to the client
        res.json({
            email: user.email,
            id: user._id,
            bio: user.bio
            // Add any other relevant account details here
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;