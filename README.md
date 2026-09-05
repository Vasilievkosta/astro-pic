# Astro Pic Bot

Telegram bot for viewing photos and videos from NASA Astronomy Picture of the Day (APOD).

## Features

- 📷 NASA photo of the day
- 🚀 Random photo from the NASA archive
- 🎥 Image and video support
- 📒 Original APOD description in English
- 🌐 Description translation to Russian

## Tech Stack

- Node.js
- grammY
- NASA APOD API
- @vitalets/google-translate-api
- Vercel Functions

## Local Development

Install dependencies:

```bash
pnpm install
```

Create `.env`:

```env
BOT_TOKEN=your_telegram_bot_token
NASA_KEY=your_nasa_api_key
WEBHOOK_URL=https://your-project.vercel.app/api/bot
```

The production bot uses a Telegram webhook, while local development uses grammY long polling.

Before starting locally, remove the webhook:

```bash
pnpm webhook:delete
```

Start the bot:

```bash
pnpm dev
```

After local development, stop the bot and restore the production webhook:

```bash
pnpm webhook:set
```

Check the registered webhook:

```bash
pnpm webhook:info
```

## Deployment

Push changes to GitHub:

```bash
git push
```

Vercel automatically creates a new production deployment.

The Telegram webhook points to:

```text
https://<vercel-domain>/api/bot
```

`BOT_TOKEN` and `NASA_KEY` must also be configured in Vercel Environment Variables.

## Cloudflare Tunnel

Cloudflare Tunnel is not required for the current local polling workflow.

For testing a local webhook server, a temporary public HTTPS URL can be created with:

```bash
cloudflared tunnel --url http://localhost:3000
```
