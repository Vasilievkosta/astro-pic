const botToken = process.env.BOT_TOKEN;

if (!botToken) {
  console.error('BOT_TOKEN is not set');
  process.exit(1);
}

try {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/getWebhookInfo`);
  const result = await response.json();

  if (!response.ok || !result.ok) {
    console.error(result);
    process.exit(1);
  }

  console.log(result);
} catch (error) {
  console.error('Telegram request failed:', error.message);
  process.exit(1);
}
