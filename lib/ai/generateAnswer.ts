const OLLAMA_URL =
  process.env.OLLAMA_BASE_URL ||
  "http://localhost:11434";

const CHAT_MODEL = "qwen2.5:1.5b";

type GenerateAnswerParams = {
  question: string;
  context: string;
};

export async function generateAnswer({
  question,
  context,
}: GenerateAnswerParams): Promise<string> {
  const prompt = `Answer the employee's question using only the policy context.

Give a complete answer in 1-2 sentences.
Be concise and direct.
Do not repeat the question.
Do not provide unnecessary explanation.
Never invent information.

If the answer is not in the context, say:
"I could not find this information in the available company policies."

Policy context:
${context}

Question:
${question}

ANSWER:`;

  console.log("📝 Prompt characters:", prompt.length);
  console.log("📝 Context characters:", context.length);

  const requestStart = Date.now();

  const response = await fetch(
    `${OLLAMA_URL}/api/generate`,
    {
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
          temperature: 0.1,
          num_ctx: 2048,
          num_predict: 150,
        },
      }),
    }
  );

  console.log(
    "⏱️ Ollama response:",
    Date.now() - requestStart,
    "ms"
  );

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ollama answer generation failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  console.log("========== QWEN RAW RESPONSE ==========");
  console.log(data);
  console.log("QWEN response:", data.response);
  console.log(
    "QWEN response type:",
    typeof data.response
  );
  console.log("========================================");
  
  if (typeof data.response !== "string") {
    console.error(
      "❌ Qwen response is not a string:",
      data.response
    );
  
    return "I could not generate a valid answer.";
  }
  
  return (
    data.response.trim() ||
    "I could not find this information in the available company policies."
  );
}