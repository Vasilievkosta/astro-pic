import { translate } from "@vitalets/google-translate-api"

export async function translateToRussian(text) {
  const result = await translate(text, { to: "ru" })

  return result.text
}
