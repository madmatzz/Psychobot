const { MongoClient } = require('mongodb');
const { logger } = require('./utils/logging');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/psybot';
let client;
let db;

async function initializeDatabase() {
    try {
        // Check if MongoDB URI is configured
        if (!process.env.MONGODB_URI) {
            logger.warn('MONGODB_URI not set, using default local connection');
        }

        client = new MongoClient(mongoUri, {
            connectTimeoutMS: 5000,
            socketTimeoutMS: 30000,
            retryWrites: true,
            retryReads: true
        });

        await client.connect();
        db = client.db();
        
        // Create indexes
        await db.collection('conversations').createIndex({ user_id: 1 });
        await db.collection('conversations').createIndex({ timestamp: 1 });
        
        logger.info('MongoDB database initialized successfully');

        // Handle connection errors
        client.on('error', (error) => {
            logger.error('MongoDB connection error:', error);
        });

        client.on('close', () => {
            logger.warn('MongoDB connection closed');
        });

    } catch (error) {
        logger.error('Failed to initialize MongoDB:', error);
        // Don't throw error, let the app continue without DB
        return false;
    }
    return true;
}

async function getConversationHistory(userId, limit = 5) {
    try {
        if (!db) {
            logger.warn('Database not initialized, returning empty history');
            return [];
        }

        const conversations = await db.collection('conversations')
            .find({ user_id: userId })
            .sort({ timestamp: -1 })
            .limit(limit)
            .toArray();

        return conversations.reverse().map(conv => ({
            role: conv.role,
            content: conv.content
        }));
    } catch (error) {
        logger.error('Error getting conversation history:', error);
        return [];
    }
}

async function saveConversation(userId, messages) {
    try {
        if (!db) {
            logger.warn('Database not initialized, skipping conversation save');
            return;
        }

        const timestamp = new Date();
        const operations = messages.map(msg => ({
            user_id: userId,
            role: msg.role,
            content: msg.content,
            timestamp
        }));

        await db.collection('conversations').insertMany(operations);
    } catch (error) {
        logger.error('Error saving conversation:', error);
    }
}

// Graceful shutdown
process.on('SIGINT', async () => {
    if (client) {
        await client.close();
        logger.info('MongoDB connection closed');
    }
    process.exit(0);
});

module.exports = {
    initializeDatabase,
    getConversationHistory,
    saveConversation
}; 