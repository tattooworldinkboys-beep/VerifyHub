
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;

if (!token) {
  console.error('Missing BOT_TOKEN environment variable.');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  bot.sendMessage(
    msg.chat.id,
    'Welcome to VerifyHub!\n\n' +
    'Submit requests for personal accounts, bots, or channels.\n' +
    'This bot manages requests; it cannot grant official Telegram badges.'
  );
});

bot.on('polling_error', (error) => {
  console.error('Telegram polling error:', error.message);
});

console.log('VerifyHub is starting...');
