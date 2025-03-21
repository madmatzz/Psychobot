require('dotenv').config();
const { Telegraf } = require('telegraf');
const { OpenAI } = require('openai');
const winston = require('winston');
const { initializeDatabase } = require('./database');
const { handleMessage } = require('./handlers/messageHandler');
const { setupLogging } = require('./utils/logging');

// Initialize logger
const logger = setupLogging();

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
});

// Initialize bot
const bot = new Telegraf(process.env.TELEGRAM_BOT_TOKEN);

// Initialize database
initializeDatabase().catch(err => {
    logger.error('Failed to initialize database:', err);
    process.exit(1);
});

// Bot middleware to handle errors
bot.catch((err, ctx) => {
    logger.error(`Error while handling update ${ctx.updateType}:`, err);
    ctx.reply('I apologize, but I encountered an error. Please try again in a moment.');
});

// Welcome message
bot.command('start', (ctx) => {
    ctx.reply(
        "Hello! I'm here to listen and support you. While I'm not a replacement for professional help, " +
        "I can offer a caring space for you to express your thoughts and feelings. How are you feeling today?"
    );
});

// Help command
bot.command('help', (ctx) => {
    ctx.reply(
        "I'm here to listen and support you. You can:\n" +
        "• Simply tell me how you're feeling\n" +
        "• Share what's on your mind\n" +
        "• Ask for coping strategies\n\n" +
        "Remember: I'm not a replacement for professional help. " +
        "If you're in crisis, please reach out to a mental health professional or emergency services."
    );
});

// Handle messages
bot.on('text', async (ctx) => {
    try {
        await handleMessage(ctx, openai);
    } catch (error) {
        logger.error('Error handling message:', error);
        ctx.reply('I apologize, but I had trouble processing your message. Please try again.');
    }
});

// Start bot
bot.launch().then(() => {
    logger.info('Bot started successfully');
}).catch(err => {
    logger.error('Failed to start bot:', err);
    process.exit(1);
});

// Enable graceful stop
process.once('SIGINT', () => bot.stop('SIGINT'));
process.once('SIGTERM', () => bot.stop('SIGTERM')); 