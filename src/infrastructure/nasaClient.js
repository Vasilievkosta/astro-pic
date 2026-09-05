const nasaKey = process.env.NASA_KEY

export async function fetchApod(type = "today") {
  if (!nasaKey) {
    throw new Error("NASA_KEY is not set")
  }

  const url = new URL("https://api.nasa.gov/planetary/apod")
  url.searchParams.set("api_key", nasaKey)
  url.searchParams.set("thumbs", "true")

  if (type === "random") {
    url.searchParams.set("count", "1")
  }

  const response = await fetch(url)

  if (!response.ok) {
    const errorText = await response.text()
    console.error("Ошибка NASA API:", errorText)
    return null
  }

  return response.json()
}
