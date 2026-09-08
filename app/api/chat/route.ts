import { NextResponse } from "next/server";
import { searchSimilarChunks } from "@/lib/ai/vectorSearch";
import { generateAnswer } from "@/lib/ai/generateAnswer";

export async function POST(req: Request) {
  const start = Date.now();

  try {
    // ==========================================
    // 1. Read request
    // ==========================================

    const body = await req.json();

    const question = body.question?.trim();

    if (!question) {
      return NextResponse.json(
        {
          success: false,
          message: "Question is required",
        },
        { status: 400 }
      );
    }

    console.log("\n==========================================");
    console.log("⏱️ Question:", question);
    console.log("==========================================");

    // ==========================================
    // 2. Vector search
    // ==========================================

    const searchStart = Date.now();

    const chunks = await searchSimilarChunks(question, 1);

    const searchTime = Date.now() - searchStart;

    console.log(
      "⏱️ Vector search:",
      searchTime,
      "ms"
    );

    console.log(
      "QUESTION:",
      question
    );

    console.log(
      "CHUNKS FOUND:",
      chunks.length
    );

    // ==========================================
    // 3. Log retrieved chunks
    // ==========================================

    chunks.forEach((chunk, index) => {
      console.log(`\n--- CHUNK ${index + 1} ---`);

      console.log(
        "Distance:",
        chunk.distance
      );

      console.log(
        "Content:",
        chunk.content
      );
    });

    // ==========================================
    // 4. No relevant policy found
    // ==========================================

    if (chunks.length === 0) {
      const answer =
        "I could not find this information in the available company policies.";

      console.log(
        "⚠️ No relevant policy chunks found"
      );

      console.log(
        "⏱️ TOTAL:",
        Date.now() - start,
        "ms"
      );

      return NextResponse.json({
        success: true,
        question,
        answer,
        sources: [],
      });
    }

    // ==========================================
    // 5. Build context
    // ==========================================

    const MAX_CONTEXT_CHARS = 1000;

    const context = chunks
      .map((chunk, index) => {
        return `Policy Source ${index + 1}:
${chunk.content}`;
      })
      .join("\n\n")
      .slice(0, MAX_CONTEXT_CHARS);

    console.log(
      "\n========== CONTEXT SENT TO QWEN =========="
    );

    console.log(context);

    console.log(
      "=========================================="
    );

    // ==========================================
    // 6. Generate answer using Qwen
    // ==========================================

    const aiStart = Date.now();

    const answer = await generateAnswer({
      question,
      context,
    });

    const generationTime = Date.now() - aiStart;

    console.log(
      "⏱️ Qwen generation:",
      generationTime,
      "ms"
    );

    console.log(
      "QWEN ANSWER:",
      answer
    );

    // ==========================================
    // 7. Total time
    // ==========================================

    console.log(
      "⏱️ TOTAL:",
      Date.now() - start,
      "ms"
    );

    // ==========================================
    // 8. Return normal JSON
    // ==========================================

    return NextResponse.json({
      success: true,
      question,
      answer,
      sources: chunks.map((chunk) => ({
        id: chunk.id,
        documentId: chunk.documentId,
        distance: chunk.distance,
      })),
    });
  } catch (error) {
    console.error(
      "❌ POST /api/chat error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to generate answer",
      },
      { status: 500 }
    );
  }
}