require('dotenv').config({ path: './server/.env' });


const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose'); // Import mongoose
const router = express.Router();
const accountRoutes = require('./accountRoutes'); // Add this line

const app = express();
app.use(cors());
app.use(express.static("dist"));
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

const stripe = require("stripe")(
    //test API key
    'sk_test_51Q9DpQFaIM9AbUlEBtxhyAFy5L3xwCrrZdg1MnVqBLR8CZ0ipTMUKpA1rPkuRQuNjiZA6fDdnkxXNak3ToSS1h3j005v0BRrRj',
  {
    apiVersion: "2023-10-16",
  }
)



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

app.post("/account_session", async (req, res) => {
    try {
        const {account} = req.body;

        const accountSession = await stripe.accountSessions.create({
            account: account,
            components: {
                account_onboarding: { enabled: true},
                account_management: {enabled: true},
                notification_banner: {enabled: true},
            },
        });

        res.json({
            client_secret: accountSession.client_secret,
        });
    } catch (error) {
        console.error(
            "An error ocurred when calling the sTRIPE api TO CREATE AN ACCOUNT SESSION",
            error
        );
        res.status(500);
        res.send({ error: error.message });
    }
});

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
                card_payments: {requested:true},
                transfers: {requested: true}
            },
            country: "GB",
        });

        res.json({
            account: account.id,
        });
    } catch (error) {
        console.error(
            "an error ocurred when calling the Stripe API to create an account",
            error
        );
        res.status(500);
        res.send({ error: error.message});
    }
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
