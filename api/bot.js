import { webhookCallback } from 'grammy';
import { bot } from '../src/bot/bot.js';

export default webhookCallback(bot, 'http');
