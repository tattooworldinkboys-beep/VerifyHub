
require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

const token = process.env.BOT_TOKEN;
const adminId = Number(process.env.ADMIN_ID);

if (!token || !adminId) {
  console.error('Set BOT_TOKEN and ADMIN_ID in .env');
  process.exit(1);
}

const bot = new TelegramBot(token, { polling: true });

bot.onText(/^\/start$/, async (msg) => {
  const text =
    'Welcome to VerifyHub!\n\n' +
    'Submit a verification request using /request.\n' +
    'Supported targets: personal accounts, bots, and channels.\n\n' +
    'This bot manages requests and does not grant official Telegram badges.';

  await bot.sendMessage(msg.chat.id, text);
});

bot.onText(/^\/request$/, async (msg) => {
  await bot.sendMessage(
    msg.chat.id,
    'What would you like to submit?',
    {
      reply_markup: {
        inline_keyboard: [
          [{ text: 'Personal account', callback_data: 'target:user' }],
          [{ text: 'Telegram bot', callback_data: 'target:bot' }],
          [{ text: 'Telegram channel', callback_data: 'target:channel' }]
        ]
      }
    }
  );
});

bot.on('callback_query', async (query) => {
  const choices = {
    'target:user': 'Personal account',
    'target:bot': 'Telegram bot',
    'target:channel': 'Telegram channel'
  };

  const selected = choices[query.data];

  if (selected) {
    await bot.answerCallbackQuery(query.id);
    await bot.sendMessage(
      query.message.chat.id,
      `Selected: ${selected}\n\nRequest submission will be added next.`
    );
  }
});

bot.onText(/^\/admin$/, async (msg) => {
  if (msg.from.id !== adminId) {
    return bot.sendMessage(msg.chat.id, 'Access denied.');
  }

  await bot.sendMessage(msg.chat.id, 'VerifyHub admin panel is working.');
});

bot.on('polling_error', (err) => {
  console.error('Polling error:', err.message);
});

console.log('VerifyHub is starting...');
  
