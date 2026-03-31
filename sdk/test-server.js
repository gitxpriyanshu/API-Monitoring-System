const express = require('express');
const ApiMonitor = require('./index.js');

const app = express();

// Use the SDK middleware with a test config to point to the local server
app.use(ApiMonitor({
    apiKey: 'apim_53947c00c5ccba542e365de484eaee3a0b1b9f4b', // Validated API key from Dashboard
    serviceName: 'Zomato-Dummy-Backend',
    ingestUrl: 'http://localhost:5001/api/hit',
    debug: true
}));

app.get('/api/users/profile', (req, res) => {
    // Artificial delay to simulate real latency
    setTimeout(() => {
        res.status(200).json({ success: true, name: 'Priyanshu Verma' });
    }, Math.floor(Math.random() * 200) + 50);
});

app.post('/api/orders/create', (req, res) => {
    setTimeout(() => {
        res.status(201).json({ success: true, orderId: '#ZOM-1923891' });
    }, Math.floor(Math.random() * 500) + 150);
});

app.get('/api/users/settings', (req, res) => {
    // Simulate a failure
    res.status(500).json({ success: false, message: 'Database connection failed' });
});

app.listen(8080, () => {
    console.log('Dummy Zomato backend running on http://localhost:8080');
    console.log('Open a new terminal and run: curl http://localhost:8080/api/users/profile');
});
