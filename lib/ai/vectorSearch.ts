import { prisma } from "@/lib/prisma";
import { generateEmbedding } from "@/lib/ai/embedText";

type SearchResult = {
  id: string;
  documentId: string;
  content: string;
  distance: number;
};

export async function searchSimilarChunks(
  question: string,
  limit = 5
): Promise<SearchResult[]> {
  // Generate embedding for the question
  const embedding = await generateEmbedding(question);

  // Convert embedding to PostgreSQL vector format
  const vector = `[${embedding.join(",")}]`;

  // Similarity threshold
  // Lower cosine distance = more similar
  const threshold = 0.35;

  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT
      "id",
      "documentId",
      "content",
      "embedding" <=> ${vector}::vector AS distance
    FROM "DocumentChunk"
    WHERE "embedding" IS NOT NULL
      AND "embedding" <=> ${vector}::vector <= ${threshold}
    ORDER BY "embedding" <=> ${vector}::vector
    LIMIT ${limit}
  `;

  return results;
}