import mongoose from 'mongoose';
import axios from 'axios';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';
import config from '../src/shared/config/index.js';
import Client from '../src/shared/models/Client.js';
import ApiKey from '../src/shared/models/ApiKey.js';
import User from '../src/shared/models/User.js';

const INGEST_URL = 'http://localhost:5001/api/hit';

const endpoints = [
    { path: '/api/users/login', methods: ['POST'], errorChance: 0.1, maxLatency: 800 },
    { path: '/api/users/profile', methods: ['GET'], errorChance: 0.05, maxLatency: 150 },
    { path: '/api/orders', methods: ['GET', 'POST'], errorChance: 0.15, maxLatency: 1200 },
    { path: '/api/products', methods: ['GET'], errorChance: 0.01, maxLatency: 200 },
    { path: '/api/payments/charge', methods: ['POST'], errorChance: 0.25, maxLatency: 2500 },
];

const sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms));

async function generateTraffic() {
    try {
        console.log('🔌 Connecting to MongoDB to provision Mock Client...');
        await mongoose.connect(config.mongo.uri);

        // 1. Create a Mock User & Client
        let mockClient = await Client.findOne({ slug: 'zomato-mock' });
        
        if (!mockClient) {
            mockClient = new Client({
                name: 'Zomato Mock',
                slug: 'zomato-mock',
                email: 'engineering@zomato.mock',
                description: 'Auto-generated mock client for traffic generation',
                isActive: true
            });
            await mockClient.save();
        }
        
        const clientId = mockClient._id;

        // 2. Create the API Key
        const rawKey = `apim_${crypto.randomBytes(20).toString('hex')}`;
        
        // Let's clear old mock keys to prevent buildup
        await ApiKey.deleteMany({ name: 'Load Test Key' });

        // 3. Find the Admin User to link
        let adminUser = await User.findOne({ username: 'admin' });
        if (!adminUser) {
            console.warn('⚠️ Warning: No local "admin" user found. Creating a temporary dummy admin ID.');
            adminUser = { _id: new mongoose.Types.ObjectId() };
        } else {
            // Update admin to link to this Client
            adminUser.clientId = clientId;
            await adminUser.save();
            console.log(`✅ Linked Zomato Mock Data to 'admin' account!`);
        }

        const apiKey = new ApiKey({
            keyId: uuidv4(),
            clientId: clientId,
            keyValue: rawKey,
            name: 'Load Test Key',
            environment: 'production',
            permissions: { canIngest: true, canRead: true },
            isActive: true,
            createdBy: adminUser._id
        });
        await apiKey.save();

        // (Removed previous update code to prevent duplication)
        console.log(`✅ Provisioned Client "Zomato Mock" with API Key: ${rawKey}`);

        // 4. Fire requests to the Ingest Server via HTTP
        console.log('🚀 Generating 500 fake hits to the API Gateway using the SDK format...');
        
        let successCount = 0;
        let rejectCount = 0;

        for (let i = 0; i < 500; i++) {
            const endpointDef = endpoints[Math.floor(Math.random() * endpoints.length)];
            const method = endpointDef.methods[Math.floor(Math.random() * endpointDef.methods.length)];
            
            // Generate realistic latency and status codes
            const isError = Math.random() < endpointDef.errorChance;
            let statusCode = 200;
            if (isError) {
                statusCode = Math.random() < 0.5 ? 400 : (Math.random() < 0.5 ? 401 : 500);
            }

            const latencyMs = Math.floor(Math.random() * endpointDef.maxLatency) + 20; // 20ms base

            const payload = {
                serviceName: 'Zomato-Backend',
                endpoint: endpointDef.path,
                method,
                statusCode,
                latencyMs,
            };

            try {
                await axios.post(INGEST_URL, payload, {
                    headers: { 'x-api-key': rawKey }
                });
                successCount++;
            } catch (error) {
                rejectCount++;
                // If the circuit breaker opens, we get a 503 or rejection
            }

            // Small delay so we don't instantly completely crash the node process
            await sleep(10); 
            
            if (i % 50 === 0 && i !== 0) {
                console.log(`...sent ${i} requests (Circuit Breaker active rejects: ${rejectCount})`);
            }
        }

        console.log(`\n🎉 Traffic Generation Complete!`);
        console.log(`Successfully sent: ${successCount}`);
        console.log(`Blocked by Circuit Breaker / App Errors: ${rejectCount}`);
        console.log(`\n👉 Go check your Dashboard at http://localhost:5174/overview !`);

        await mongoose.disconnect();
        process.exit(0);

    } catch (error) {
        console.error('❌ Failed to generate traffic:', error.message);
        process.exit(1);
    }
}

generateTraffic();
