# PsyBot - Therapeutic Telegram Chatbot

A compassionate AI-powered Telegram chatbot designed to provide emotional support and active listening. Built with Node.js, Telegraf.js, and OpenAI's GPT-4.

## Features

- 🤝 Empathetic and supportive conversations
- 🧠 Powered by GPT-4 for natural, context-aware responses
- 💾 Conversation memory for better context
- 🚨 Crisis detection and appropriate response handling
- 📝 Detailed logging system
- 🔒 SQLite database for conversation storage

## Prerequisites

- Node.js (v14 or higher)
- Telegram Bot Token (from [@BotFather](https://t.me/botfather))
- OpenAI API Key

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/psybot.git
cd psybot
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```

4. Edit `.env` and add your credentials:
```
TELEGRAM_BOT_TOKEN=your_telegram_bot_token
OPENAI_API_KEY=your_openai_api_key
```

5. Create the data directory:
```bash
mkdir -p data logs
```

## Running the Bot

Development mode (with auto-reload):
```bash
npm run dev
```

Production mode:
```bash
npm start
```

## Usage

1. Start a conversation with your bot on Telegram
2. Use `/start` to begin
3. Use `/help` to see available commands
4. Simply chat with the bot about your feelings or concerns

## Deployment

The bot can be deployed to various platforms:

- Railway: [![Deploy on Railway](https://railway.app/button.svg)](https://railway.app/new/template?template=https://github.com/yourusername/psybot)
- Render
- Any VPS with Node.js support

## Important Notes

- This bot is not a replacement for professional mental health support
- In case of crisis, the bot will provide emergency contact information
- All conversations are stored securely in the SQLite database

## License

MIT

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. 