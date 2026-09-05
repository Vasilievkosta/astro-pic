const botToken = process.env.BOT_TOKEN;
const webhookUrl = process.env.WEBHOOK_URL;

if (!botToken) {
  console.error('BOT_TOKEN is not set');
  process.exit(1);
}

if (!webhookUrl) {
  console.error('WEBHOOK_URL is not set');
  process.exit(1);
}

try {
  const response = await fetch(`https://api.telegram.org/bot${botToken}/setWebhook`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url: webhookUrl,
    }),
  });

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
