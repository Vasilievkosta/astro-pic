import { Bot } from "grammy"
import { getApod } from "../application/getApod.js"
import { translateToRussian } from "../infrastructure/translator.js"
import { getExplanation, getTranslation, saveExplanation, saveTranslation } from "./chatState.js"
import { getMenuKeyboard } from "./keyboard.js"

const botToken = process.env.BOT_TOKEN

if (!botToken) {
  throw new Error("BOT_TOKEN is not set")
}

export const bot = new Bot(botToken)

async function sendApod(ctx, type = "today") {
  let loadingMsgSent = false

  const timer = setTimeout(async () => {
    loadingMsgSent = true
    await ctx.reply("⏳ Загружаю контент... фото бывают большие, но красивые!")
    await ctx.replyWithChatAction("upload_photo")
  }, 3000)

  try {
    const item = await getApod(type)
    clearTimeout(timer)

    if (!loadingMsgSent) {
      await ctx.replyWithChatAction("upload_photo")
    }

    if (!item) {
      await ctx.reply("Не удалось получить фото 😢")
      return
    }

    saveExplanation(ctx.chat.id, item.explanation)

    if (item.mediaType === "image") {
      await ctx.replyWithPhoto(item.url, {
        caption: `${item.title}\nDate: ${item.date}`,
      })
      return
    }

    if (item.mediaType === "video") {
      if (item.thumbnailUrl) {
        await ctx.replyWithPhoto(item.thumbnailUrl, {
          caption: `${item.title}\n\nВидео 🎥: ${item.url}\n🗓️ ${item.date}\nℹ️ В Telegram Web может быть ошибка 153. Открой напрямую в YouTube 👆`,
        })
        return
      }

      await ctx.reply(
        `Сегодняшний контент — видео 🎥\n${item.url}\n\nℹ️ В Telegram Web может быть ошибка 153. Открой напрямую в YouTube 👆`,
      )
      return
    }

    console.warn("Неизвестный тип медиа:", item.mediaType, item)
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
  const chatId = ctx.chat.id

  if (text === "фото" || text === "📷 Фото дня") {
    await sendApod(ctx, "today")
    return
  }

  if (text === "🚀 Фото из архива NASA 🔭") {
    await sendApod(ctx, "random")
    return
  }

  if (text === "📒 Описание фото (EN)") {
    const explanation = getExplanation(chatId)

    if (explanation) {
      await ctx.reply(explanation)
    } else {
      await ctx.reply("Сначала запроси фото 📷, потом будет доступно описание.")
    }
    return
  }

  if (text === "🌐 Перевод описания (RU)") {
    const explanation = getExplanation(chatId)

    if (!explanation) {
      await ctx.reply("Сначала запроси фото 📷, потом будет доступен перевод.")
      return
    }

    const translation = getTranslation(chatId)

    if (translation) {
      await ctx.reply(translation)
      return
    }

    try {
      const translatedText = await translateToRussian(explanation)
      saveTranslation(chatId, translatedText)
      await ctx.reply(translatedText)
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
