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
  const embedding = await generateEmbedding(question);

  const vector = `[${embedding.join(",")}]`;

  const results = await prisma.$queryRaw<SearchResult[]>`
    SELECT
      "id",
      "documentId",
      "content",
      "embedding" <=> ${vector}::vector AS distance
    FROM "DocumentChunk"
    WHERE "embedding" IS NOT NULL
    ORDER BY "embedding" <=> ${vector}::vector
    LIMIT ${limit}
  `;

  console.log("\n========== VECTOR SEARCH ==========");
  console.log("Question:", question);
  console.log("Results:", results.length);

  results.forEach((result, index) => {
    console.log(`\n--- RESULT ${index + 1} ---`);
    console.log("Distance:", result.distance);
    console.log("Content:", result.content);
  });

  console.log("===================================\n");

  return results;
}