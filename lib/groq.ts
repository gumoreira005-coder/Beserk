import Groq from "groq-sdk"

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
})

type Message = {
  role: "system" | "user" | "assistant"
  content: string
}

export async function chatWithGroq(messages: Message[]): Promise<string> {
  const completion = await groq.chat.completions.create({
    messages,
    model: "llama-3.3-70b-versatile",
    temperature: 0.7,
    max_tokens: 1024,
  })

  return completion.choices[0]?.message?.content ?? ""
}

export { groq }
