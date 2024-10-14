require('dotenv').config({ path: './server/.env' });
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const accountRoutes = require('./accountRoutes');
const djRoutes = require('./djRoutes'); // Ensure this is the correct path
const authRoutes = require('./authRoutes');
const multer = require('multer');
const path = require('path');
const DjProfile = require('./models/DjProfileForm')

const app = express();
app.use(cors());
app.use(express.static("dist"));
app.use(express.json());

// Configure Multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, 'uploads')); // Store files in the 'uploads' folder inside the server directory
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    },
});

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb('Error: File upload only supports the following filetypes - ' + filetypes);
    }
});

// Serve uploaded files statically
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Upload endpoint
app.post('/upload', upload.single('profilePicture'), async (req, res) => {
    if (!req.file) {
        console.error('File not received');
        return res.status(400).json({ error: 'No file uploaded' });
    }

    const url = `/uploads/${req.file.filename}`; // Relative URL

    try {
        // Assuming you have the user's email in the request body or JWT token
        const userEmail = req.body.email || req.user.email; // Adjust based on your authentication method
        
        // Update the user's profile in the database
        await DjProfile.findOneAndUpdate(
            { email: userEmail },
            { profilePicture: url },
            { new: true }
        );

        res.json({ url });
    } catch (error) {
        console.error('Error updating profile:', error);
        res.status(500).json({ error: 'Failed to update profile' });
    }
});

// MongoDB connection
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
        process.exit(1);
    }
};

connectDB();

const stripe = require("stripe")(
    // Test API key
    'sk_test_51Q9DpQFaIM9AbUlEBtxhyAFy5L3xwCrrZdg1MnVqBLR8CZ0ipTMUKpA1rPkuRQuNjiZA6fDdnkxXNak3ToSS1h3j005v0BRrRj',
    {
        apiVersion: "2023-10-16",
    }
);

// Use your routers
app.use('/account', accountRoutes);
app.use('/api', djRoutes);
app.use('/auth', authRoutes);

// Sample endpoint
app.get('/api', (req, res) => {
    res.send('API is running...');
});

// Account session endpoint
app.post("/account_session", async (req, res) => {
    try {
        const { account } = req.body;

        const accountSession = await stripe.accountSessions.create({
            account: account,
            components: {
                account_onboarding: { enabled: true },
                account_management: { enabled: true },
                notification_banner: { enabled: true },
            },
        });

        res.json({
            client_secret: accountSession.client_secret,
        });
    } catch (error) {
        console.error("An error occurred when calling the Stripe API to create an account session", error);
        res.status(500).send({ error: error.message });
    }
});

// Account setup endpoint
app.post("/accountsetup", async (req, res) => {
    try {
        const account = await stripe.accounts.create({
            controller: {
                stripe_dashboard: {
                    type: "none",
                },
                fees: {
                    payer: "application"
                },
            },
            capabilities: {
                card_payments: { requested: true },
                transfers: { requested: true }
            },
            country: "GB",
        });

        res.json({
            account: account.id,
        });
    } catch (error) {
        console.error("An error occurred when calling the Stripe API to create an account", error);
        res.status(500).send({ error: error.message });
    }
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});
