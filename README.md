# Astro Pic Bot

Telegram bot for viewing NASA Astronomy Picture of the Day (APOD) content.

The bot can:
- show the NASA photo of the day;
- return a random photo from the NASA archive;
- show the original APOD description in English;
- translate the description into Russian;
- handle both images and videos.

## Tech stack

- Node.js
- grammY
- NASA APOD API
- Vercel Functions
- @vitalets/google-translate-api

## Local development

Create `.env`:

```env
BOT_TOKEN=your_telegram_bot_token
NASA_KEY=your_nasa_api_key
WEBHOOK_URL=https://your-production-domain.vercel.app/api/bot
