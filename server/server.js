require('dotenv').config({ path: './server/.env' });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const router = express.Router();
const accountRoutes = require('./accountRoutes'); // Add this line

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

app.use('/account', accountRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
