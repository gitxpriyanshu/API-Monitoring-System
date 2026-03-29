const express = require('express');
const { ApiMonitor } = require('../sdk/index.js');

const app = express();
const PORT = 4000;

/**
 * 🚀 API MONITOR INTEGRATION
 * Simply add this middleware at the top of your Express app!
 * 
 * Replace 'YOUR_API_KEY_HERE' with a real key from your dashboard.
 * Get your key by logging into http://localhost:5173 
 */
app.use(ApiMonitor({
    apiKey: 'apim_afab4da7a8790d934294e8f7dfddad0bc1236a24', // Example key from our last seed run
    serviceName: 'Zomato-Delivery-App',
    ingestUrl: 'http://localhost:5001/api/hit'
}));

app.use(express.json());

// --- MOCK API ROUTES ---

app.get('/api/v1/menu', (req, res) => {
    // Artificial latency simulation
    setTimeout(() => {
        res.status(200).json({
            status: 'success',
            items: ['Pizza', 'Burger', 'Pasta']
        });
    }, 120);
});

app.post('/api/v1/order', (req, res) => {
    const { itemId } = req.body;
    
    // Random error simulation (15% chance)
    if (Math.random() < 0.15) {
        return res.status(500).json({ error: 'Payment gateway timeout!' });
    }

    res.status(201).json({
        orderId: Math.floor(Math.random() * 9999),
        status: 'Preparing'
    });
});

app.get('/api/v1/health', (req, res) => {
    res.status(200).send('OK');
});

// START THE CLIENT APP
app.listen(PORT, () => {
    console.log(`\x1b[35m%s\x1b[0m`, `--------------------------------------------------------`);
    console.log(`🚀 MOCK CLIENT APP RUNNING ON PORT ${PORT}`);
    console.log(`📊 ALL HITS ARE NOW BEING TRACKED IN THE DASHBOARD!`);
    console.log(`--------------------------------------------------------`);
    console.log(`Try hitting: http://localhost:${PORT}/api/v1/menu`);
    console.log(`--------------------------------------------------------`);
});
