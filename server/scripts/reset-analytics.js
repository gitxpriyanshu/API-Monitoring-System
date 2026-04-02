import mongoose from 'mongoose';
import postgres from '../src/shared/config/postgres.js';
import logger from '../src/shared/config/logger.js';
import dotenv from 'dotenv';

dotenv.config();

async function resetAnalytics() {
    try {
        console.log('🧹 Starting analytics data purge...');

        // 1. Connect to MongoDB
        await mongoose.connect(process.env.MONGO_URI, {
            dbName: process.env.MONGO_DB_NAME
        });
        console.log('✅ Connected to MongoDB');

        // 2. Wipe Mongo Raw API Hits
        const mongooseResult = await mongoose.connection.collection('apihits').deleteMany({});
        console.log(`🗑️ Wiped ${mongooseResult.deletedCount} raw hits from MongoDB`);

        // 3. Connect to PostgreSQL
        await postgres.testConnection();
        console.log('✅ Connected to PostgreSQL');

        // 4. Wipe Postgres Aggregated Metrics
        const pgResult = await postgres.query('TRUNCATE TABLE endpoint_metrics RESTART IDENTITY');
        console.log(`🗑️ Wiped aggregated metrics from PostgreSQL`);

        console.log('🥂 Analytics Dashboard successfully reset!');

    } catch (error) {
        console.error('❌ Error resetting analytics:', error.message);
    } finally {
        await mongoose.disconnect();
        await postgres.close();
        process.exit(0);
    }
}

resetAnalytics();
