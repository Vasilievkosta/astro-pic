import { Bot, webhookCallback } from 'grammy';

const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  throw new Error('BOT_TOKEN is not set');
}

const bot = new Bot(botToken);

bot.on('message:text', async (ctx) => {
  await ctx.reply(ctx.message.text);
});

export default webhookCallback(bot, 'http');
