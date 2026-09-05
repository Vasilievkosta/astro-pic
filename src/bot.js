import { Bot } from "grammy"

const botToken = process.env.BOT_TOKEN
const nasaKey = process.env.NASA_KEY

if (!botToken) {
  throw new Error("BOT_TOKEN is not set")
}

export const bot = new Bot(botToken)

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text

  if (text === "фото") {
    if (!nasaKey) {
      throw new Error("NASA_KEY is not set")
    }

    const url = new URL("https://api.nasa.gov/planetary/apod")
    url.searchParams.set("api_key", nasaKey)

    const response = await fetch(url)
    const photo = await response.json()

    await ctx.replyWithPhoto(photo.url, {
      caption: `${photo.title}\n${photo.date}`,
    })

    return
  }

  await ctx.reply(text)
})
