const CRISIS_KEYWORDS = [
    'suicide', 'kill myself', 'end my life', 'want to die',
    'self-harm', 'cutting myself', 'hurting myself',
    'overdose', 'no reason to live', 'better off dead'
];

function detectCrisis(message) {
    const lowercaseMessage = message.toLowerCase();
    return CRISIS_KEYWORDS.some(keyword => lowercaseMessage.includes(keyword));
}

module.exports = {
    detectCrisis
}; 