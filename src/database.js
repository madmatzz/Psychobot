const { MongoClient } = require('mongodb');
const { logger } = require('./utils/logging');

const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/psybot';
let client;
let db;

async function initializeDatabase() {
    try {
        client = new MongoClient(mongoUri);
        await client.connect();
        db = client.db();
        
        // Create indexes
        await db.collection('conversations').createIndex({ user_id: 1 });
        await db.collection('conversations').createIndex({ timestamp: 1 });
        
        logger.info('MongoDB database initialized successfully');
    } catch (error) {
        logger.error('Failed to initialize MongoDB:', error);
        throw error;
    }
}

async function getConversationHistory(userId, limit = 5) {
    try {
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
        throw error;
    }
}

async function saveConversation(userId, messages) {
    try {
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
        throw error;
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