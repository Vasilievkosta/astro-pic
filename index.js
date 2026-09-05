import Fastify from "fastify"

const fastify = Fastify()
const port = process.env.PORT || 3000
const botToken = process.env.BOT_TOKEN

fastify.get("/", async () => {
  return { message: "Server is running" }
})

fastify.post("/webhook", async (request, reply) => {
  const message = request.body?.message
  const text = message?.text
  const chatId = message?.chat?.id

  if (text && chatId) {
    if (!botToken) {
      reply.code(500)
      return { ok: false, error: "BOT_TOKEN is not set" }
    }

    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        chat_id: chatId,
        text,
      }),
    })

    if (!response.ok) {
      reply.code(500)
      return { ok: false }
    }
  }

  return { ok: true }
})

try {
  await fastify.listen({ port })
  console.log(`Server is running at http://localhost:${port}`)
} catch (error) {
  console.error(error)
  process.exit(1)
}
