const OLLAMA_URL = process.env.OLLAMA_URL || "http://localhost:11434";

const EMBEDDING_MODEL = "nomic-embed-text";

export async function generateEmbedding(text: string): Promise<number[]> {
  const response = await fetch(`${OLLAMA_URL}/api/embed`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: EMBEDDING_MODEL,
      input: text,
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();

    throw new Error(
      `Ollama embedding failed: ${response.status} ${errorText}`
    );
  }

  const data = await response.json();

  if (!data.embeddings || !data.embeddings[0]) {
    throw new Error("Ollama returned no embedding");
  }

  return data.embeddings[0];
}