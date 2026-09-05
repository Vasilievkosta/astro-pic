import { Bot, Keyboard } from "grammy"
import { translate } from "@vitalets/google-translate-api"

const botToken = process.env.BOT_TOKEN
const nasaKey = process.env.NASA_KEY

if (!botToken) {
  throw new Error("BOT_TOKEN is not set")
}

export const bot = new Bot(botToken)

let lastExplanation = null
let lastTranslation = null

function getMenuKeyboard() {
  return new Keyboard()
    .text("📷 Фото дня")
    .row()
    .text("🚀 Фото из архива NASA 🔭")
    .row()
    .text("📒 Описание фото (EN)")
    .row()
    .text("🌐 Перевод описания (RU)")
    .row()
    .text("ℹ️ О боте")
    .resized()
}

async function getApod(ctx, type = "today") {
  if (!nasaKey) {
    throw new Error("NASA_KEY is not set")
  }

  const url = new URL("https://api.nasa.gov/planetary/apod")
  url.searchParams.set("api_key", nasaKey)
  url.searchParams.set("thumbs", "true")

  if (type === "random") {
    url.searchParams.set("count", "1")
  }

  let loadingMsgSent = false

  const timer = setTimeout(async () => {
    loadingMsgSent = true
    await ctx.reply("⏳ Загружаю контент... фото бывают большие, но красивые!")
    await ctx.replyWithChatAction("upload_photo")
  }, 3000)

  try {
    const response = await fetch(url)
    clearTimeout(timer)

    if (!loadingMsgSent) {
      await ctx.replyWithChatAction("upload_photo")
    }

    if (!response.ok) {
      const errorText = await response.text()
      console.error("Ошибка NASA API:", errorText)
      await ctx.reply("Не удалось получить фото 😢")
      return
    }

    const data = await response.json()
    const item = Array.isArray(data) ? data[0] : data

    lastExplanation = item.explanation
    lastTranslation = null

    if (item.media_type === "image") {
      await ctx.replyWithPhoto(item.url, {
        caption: `${item.title}\nDate: ${item.date}`,
      })
      return
    }

    if (item.media_type === "video") {
      if (item.thumbnail_url) {
        await ctx.replyWithPhoto(item.thumbnail_url, {
          caption: `${item.title}\n\nВидео 🎥: ${item.url}\n🗓️ ${item.date}\nℹ️ В Telegram Web может быть ошибка 153. Открой напрямую в YouTube 👆`,
        })
        return
      }

      await ctx.reply(
        `Сегодняшний контент — видео 🎥\n${item.url}\n\nℹ️ В Telegram Web может быть ошибка 153. Открой напрямую в YouTube 👆`,
      )
      return
    }

    console.warn("Неизвестный тип медиа:", item.media_type, item)
    await ctx.reply(
      "NASA прислало неизвестный тип медиа 🤔\n" + "Попробуй запросить ещё раз 📷 Фото дня или 🔭 Фото из архива.",
    )
  } catch (error) {
    clearTimeout(timer)
    console.error("Ошибка при запросе:", error)
    await ctx.reply("Не удалось получить фото 😢 (ошибка сети)")
  }
}

bot.command("start", async (ctx) => {
  await ctx.reply(
    "✨ Добро пожаловать!\n" +
      "Здесь можно увидеть красивые фото и видео из архива NASA.\n" +
      "Хочешь фото? Нажми 📷 Фото дня или 🌌 Фото из архива 🚀",
    {
      reply_markup: getMenuKeyboard(),
    },
  )
})

bot.on("message:text", async (ctx) => {
  const text = ctx.message.text

  if (text === "фото" || text === "📷 Фото дня") {
    await getApod(ctx, "today")
    return
  }

  if (text === "🚀 Фото из архива NASA 🔭") {
    await getApod(ctx, "random")
    return
  }

  if (text === "📒 Описание фото (EN)") {
    if (lastExplanation) {
      await ctx.reply(lastExplanation)
    } else {
      await ctx.reply("Сначала запроси фото 📷, потом будет доступно описание.")
    }
    return
  }

  if (text === "🌐 Перевод описания (RU)") {
    if (!lastExplanation) {
      await ctx.reply("Сначала запроси фото 📷, потом будет доступен перевод.")
      return
    }

    if (lastTranslation) {
      await ctx.reply(lastTranslation)
      return
    }

    try {
      const result = await translate(lastExplanation, { to: "ru" })
      lastTranslation = result.text
      await ctx.reply(lastTranslation)
    } catch (error) {
      console.error("Ошибка перевода:", error)
      await ctx.reply("Ошибка перевода 😢")
    }
    return
  }

  if (text === "ℹ️ О боте") {
    await ctx.reply(
      "Этот сервис 📒 показывает красивые фото и видео из архива NASA.\n" +
        "Есть оригинальное описание (EN) или перевод (RU).",
    )
    return
  }

  await ctx.reply(text)
})
