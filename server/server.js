const express = require('express');
const cors = require('cors');
const app = express();
const djRoutes = require('./djRoutes'); // Update this path according to your router file

app.use(cors());
app.use(express.json());

// Use your router for the /api path
app.use('/api', djRoutes); 

// Sample endpoint
app.get('/api', (req, res) => {
    res.send('API is running...');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
