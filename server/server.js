require('dotenv').config({ path: './server/.env' });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const router = express.Router();

const app = express();
app.use(cors());
app.use(express.json());


const mongoUri = process.env.MONGODB_URI;


const connectDB = async () => {
    try {
        await mongoose.connect(mongoUri, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log('MongoDB connected');
    } catch (error) {
        console.error('MongoDB connection error:', error);
        process.exit(1); // Exit the process with failure
    }
};

connectDB(); // Call the function to connect to MongoDB

// Use your router for the /api path
const djRoutes = require('./djRoutes'); // Update the path accordingly
app.use('/api', djRoutes);

const authRoutes = require('./authRoutes'); // Import the auth routes
app.use('/auth', authRoutes);




// Sample endpoint
app.get('/api', (req, res) => {
    res.send('API is running...');
});

const authenticateToken = require('./authMiddleware');
app.use('/account', authenticateToken);

router.get('/account', authenticateToken, async (req, res) => {
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
        // Add any other relevant account details here
      });
    } catch (error) {
      console.error('Error fetching user data:', error);
      res.status(500).json({ message: 'Server error' });
    }
  });
  

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
