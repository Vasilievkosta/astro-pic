const chatStates = new Map()

function getChatState(chatId) {
  if (!chatStates.has(chatId)) {
    chatStates.set(chatId, {
      explanation: null,
      translation: null,
    })
  }

  return chatStates.get(chatId)
}

export function saveExplanation(chatId, explanation) {
  const state = getChatState(chatId)
  state.explanation = explanation
  state.translation = null
}

export function getExplanation(chatId) {
  return getChatState(chatId).explanation
}

export function getTranslation(chatId) {
  return getChatState(chatId).translation
}

export function saveTranslation(chatId, translation) {
  getChatState(chatId).translation = translation
}
