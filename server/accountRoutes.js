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
            bio: user.bio,
            name: user.name
            // Add any other relevant account details here
        });
    } catch (error) {
        console.error('Error fetching user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

router.put('/', authenticateToken, async (req, res) => {
    try {
        const { name, bio } = req.body;
        // Log the data being received
        console.log('Update request:', { userId: req.user.userId, name, bio });

        const updatedUser = await DjProfile.findByIdAndUpdate(
            req.user.userId,
            { $set: { name, bio } }, // Use $set to ensure fields are updated
            { new: true, runValidators: true }
        );

        if (!updatedUser) {
            console.log('User not found:', req.user.userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Log the updated user
        console.log('Updated user:', updatedUser);

        res.json({
            name: updatedUser.name,
            bio: updatedUser.bio,
            email: updatedUser.email,
            id: updatedUser._id
        });
    } catch (error) {
        console.error('Error updating user data:', error);
        res.status(500).json({ message: 'Server error' });
    }
});


module.exports = router;