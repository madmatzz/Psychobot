const { getConversationHistory, saveConversation } = require('../database');
const { detectCrisis } = require('../utils/crisisDetection');
const { logger } = require('../utils/logging');

const SYSTEM_PROMPT = `You are a compassionate and supportive AI companion focused on emotional well-being. Your responses should:
- Be empathetic and non-judgmental
- Use active listening techniques
- Validate feelings while encouraging positive coping strategies
- Never provide medical diagnoses or prescriptions
- Keep responses concise but meaningful (2-4 sentences)
- Use a warm, conversational tone
- Maintain appropriate therapeutic boundaries

If you detect signs of crisis, gently suggest professional help and provide crisis resources.`;

const CRISIS_RESPONSE = `I hear how much pain you're in, and I want you to know that you're not alone. While I'm here to listen, I strongly encourage you to reach out to a mental health professional or crisis counselor who can provide the support you need right now. Would you like me to share some crisis helpline numbers?

Crisis Resources:
• National Crisis Hotline (US): 988
• Crisis Text Line: Text HOME to 741741
• Emergency Services: 911 (US) or 112 (EU)`;

async function handleMessage(ctx, openai) {
    const userId = ctx.from.id;
    const userMessage = ctx.message.text;

    try {
        // Check for crisis indicators
        if (detectCrisis(userMessage)) {
            await ctx.reply(CRISIS_RESPONSE);
            return;
        }

        // Get conversation history
        const conversationHistory = await getConversationHistory(userId);

        // Prepare messages for OpenAI
        const messages = [
            { role: 'system', content: SYSTEM_PROMPT },
            ...conversationHistory.map(msg => ({
                role: msg.role,
                content: msg.content
            })),
            { role: 'user', content: userMessage }
        ];

        // Get response from OpenAI
        const completion = await openai.chat.completions.create({
            model: 'gpt-4-turbo-preview',
            messages: messages,
            temperature: 0.7,
            max_tokens: 150
        });

        const aiResponse = completion.choices[0].message.content;

        // Save conversation to database
        await saveConversation(userId, [
            { role: 'user', content: userMessage },
            { role: 'assistant', content: aiResponse }
        ]);

        // Send response to user
        await ctx.reply(aiResponse);

    } catch (error) {
        logger.error('Error in handleMessage:', error);
        throw error;
    }
}

module.exports = {
    handleMessage
}; 