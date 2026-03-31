# API Monitoring SaaS & Live SDK 🚀

A highly-scalable, production-ready SaaS platform that records zero-latency telemetry and visualizes live traffic from external APIs.

## 🔥 Quick Project Overview
*   **Identified** the need for an enterprise-grade API monitoring system to improve backend observability and track real-time traffic health.
*   **Developed** a robust full-stack SaaS platform and a standalone Node.js/Express SDK to safely intercept, process, and visualize API telemetry efficiently.
*   **Implemented** secure API key provisioning, asynchronous traffic tracking, rate-limiting, and an interactive real-time analytics dashboard over WebSockets.
*   **Built** using React, Node.js, Express.js, PostgreSQL, MongoDB, and RabbitMQ, featuring a highly scalable, fail-safe microservices architecture.

---

## 🛠️ Integrating the Public SDK

If you are a developer looking to integrate our telemetry system into your own Node.js backend to get instant dashboard analytics, follow these steps:

### 1. Installation
Install the required packages in your project via NPM:
```bash
npm install apimonitor-node axios
```

### 2. Integration Code
Drop these 3 lines of code into your `server.js` or `app.js` file, exactly **before** your API routes are defined:

```javascript
const express = require('express');

// 1. Require the SDK
const ApiMonitor = require('apimonitor-node'); 

const app = express();

// 2. Initialize the Monitor (Must be placed BEFORE your routes)
app.use(ApiMonitor({
    apiKey: 'PASTE_YOUR_API_KEY_HERE',     // The key generated from your SaaS Dashboard
    serviceName: 'My-Ecommerce-Backend',   // The friendly name of your microservice
    
    // (Optional) Remove this ingestUrl line to default to our production servers
    // ingestUrl: 'https://api-monitoring-backend-n8ln.onrender.com/api/hit',
}));

// 3. Your standard API routes go here...
app.get('/api/users', (req, res) => {
    res.json({ message: "Hello World" });
});

app.listen(3000, () => console.log('Successfully connected to API Monitoring SaaS!'));
```

That's it! Once you add that `.use()` block, the SDK automatically intercepts `res.end()` to silently push exact latency, `User-Agent`, IP, Method, and Status Code metrics to your centralized Dashboard—without blocking your Node Event Loop or lagging your backend. 🥂✨
