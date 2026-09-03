
const OLLAMA_URL =
  process.env.OLLAMA_URL || "http://localhost:11434";

const CHAT_MODEL = "qwen2.5:3b";

type GenerateAnswerParams = {
  question: string;
  context: string;
};

export async function generateAnswer({
  question,
  context,
}: GenerateAnswerParams): Promise<string> {
  const prompt = `You are a Company Policy AI Assistant.

Answer ONLY from the POLICY CONTEXT below.

Rules:
- Use only the provided policy context.
- Do not use general knowledge.
- Do not invent information.
- If the answer is not in the context, respond exactly:
"I could not find this information in the available company policies."
- Give a short and direct answer.

POLICY CONTEXT:
${context}

QUESTION:
${question}

ANSWER:`;

  const response = await fetch(`${OLLAMA_URL}/api/generate`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: CHAT_MODEL,
      prompt,
      stream: false,
      keep_alive: "10m",
      options: {
        temperature: 0,
        num_ctx: 2048,
        num_predict: 150,
      },
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ollama answer generation failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.response) {
    throw new Error("Ollama returned no answer");
  }

  return data.response.trim();
}

