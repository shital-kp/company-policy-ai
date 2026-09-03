import { NextResponse } from "next/server";
import { searchSimilarChunks } from "@/lib/ai/vectorSearch";
import { generateAnswer } from "@/lib/ai/generateAnswer";

export async function POST(req: Request) {
  try {

    const start = Date.now();
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

    console.log("⏱️ Question:", question);

    const searchStart = Date.now();

    // 1. Find relevant policy chunks
    const chunks = await searchSimilarChunks(question, 3);

    console.log(
      "⏱️ Vector search:",
      Date.now() - searchStart,
      "ms"
    );

    console.log("QUESTION:", question);
    console.log("CHUNKS FOUND:", chunks.length);

    chunks.forEach((chunk, index) => {
      console.log(`\n--- CHUNK ${index + 1} ---`);
      console.log(chunk.content);
      console.log("DISTANCE:", chunk.distance);
    });

    if (chunks.length === 0) {
      return NextResponse.json({
        success: true,
        question,
        answer:
          "I could not find this information in the available company policies.",
        sources: [],
      });
    }

    // 2. Build context for Qwen
    const context = chunks
      .map((chunk, index) => {
        return `Policy Source ${index + 1}:
${chunk.content}`;
      })
      .join("\n\n");

      const aiStart = Date.now();

    console.log("\n========== CONTEXT SENT TO QWEN ==========");
    console.log(context);
    console.log("==========================================");

    // 3. Generate answer using retrieved policy context
    const answer = await generateAnswer({
      question,
      context,
    });

    console.log(
      "⏱️ Qwen generation:",
      Date.now() - aiStart,
      "ms"
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
      sources: chunks.map((chunk) => ({
        id: chunk.id,
        documentId: chunk.documentId,
        distance: chunk.distance,
      })),
    });
  } catch (error) {
    console.error("POST /api/chat error:", error);

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