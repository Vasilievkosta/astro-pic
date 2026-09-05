import { Keyboard } from "grammy"

export function getMenuKeyboard() {
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
