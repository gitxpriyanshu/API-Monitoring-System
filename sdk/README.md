# API Monitor SDK (Node.js/Express)

Legit and lightweight middleware for tracking your API's hits, latencies, and error rates securely. It streams real-time data to your custom analytics dashboard.

## Installation

Since this package is currently local, you can link it to your project, or publish it to npm. 

```bash
npm install apimonitor-node
```
*(If not published, just copy the `index.js` into your codebase and run `npm install axios`).*

## Quick Start (Express.js)

```javascript
const express = require('express');
const ApiMonitor = require('apimonitor-node');

const app = express();

// 1. Initialize the middleware with your unique API Key 
app.use(ApiMonitor({
    apiKey: 'apim_XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX',
    serviceName: 'Zomato-Backend-API',
    debug: false // Set to true to see success/failure console logs
}));

// 2. Add your standard routes 
app.get('/api/users/profile', (req, res) => {
    res.status(200).json({ success: true, name: 'Priyanshu' });
});

app.listen(3000, () => console.log('Zomato backend running on 3000'));
```

## How It Works
The SDK acts as an Express middleware. It automatically intercepts HTTP `res.end()` for every incoming hit, safely extracts (`latency`, `status`, `route`, `user-agent`, `ip`), and background-pushes it to your monitoring SaaS without generating any latency overhead on your app.

**Silent Fail architecture:** If your monitoring system goes down, this SDK quietly catches the timeout to prevent crashing the external developer's API. 
