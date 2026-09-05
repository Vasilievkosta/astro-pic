import { fetchApod } from "../infrastructure/nasaClient.js"

export async function getApod(type = "today") {
  const data = await fetchApod(type)

  if (!data) {
    return null
  }

  const item = Array.isArray(data) ? data[0] : data

  return {
    date: item.date,
    explanation: item.explanation,
    mediaType: item.media_type,
    thumbnailUrl: item.thumbnail_url,
    title: item.title,
    url: item.url,
  }
}
