import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { searchSimilarChunks } from "@/lib/ai/vectorSearch";
import { generateAnswer } from "@/lib/ai/generateAnswer";

// Temporary user until authentication is added
const TEMP_USER_ID = "REPLACE_WITH_EXISTING_USER_ID";

export async function POST(req: Request) {
  try {
    const start = Date.now();
    const body = await req.json();

    const question = body.question?.trim();
    const chatId = body.chatId;

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

    // --------------------------------------------------
    // 1. Find existing chat or create a new chat
    // --------------------------------------------------

    let chat;

    if (chatId) {
      chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId: TEMP_USER_ID,
        },
      });

      if (!chat) {
        return NextResponse.json(
          {
            success: false,
            message: "Chat not found",
          },
          { status: 404 }
        );
      }
    } else {
      chat = await prisma.chat.create({
        data: {
          userId: TEMP_USER_ID,
          title: question.substring(0, 50),
        },
      });
    }

    // --------------------------------------------------
    // 2. Save USER message
    // --------------------------------------------------

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "USER",
        content: question,
      },
    });

    // --------------------------------------------------
    // 3. Vector search
    // --------------------------------------------------

    const searchStart = Date.now();

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

    // --------------------------------------------------
    // 4. No relevant policy found
    // --------------------------------------------------

    if (chunks.length === 0) {
      const answer =
        "I could not find this information in the available company policies.";

      await prisma.chatMessage.create({
        data: {
          chatId: chat.id,
          role: "ASSISTANT",
          content: answer,
        },
      });

      return NextResponse.json({
        success: true,
        chatId: chat.id,
        question,
        answer,
        sources: [],
      });
    }

    // --------------------------------------------------
    // 5. Build context for Qwen
    // --------------------------------------------------

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

    // --------------------------------------------------
    // 6. Generate AI answer
    // --------------------------------------------------

    const answer = await generateAnswer({
      question,
      context,
    });

    console.log(
      "⏱️ Qwen generation:",
      Date.now() - aiStart,
      "ms"
    );

    // --------------------------------------------------
    // 7. Save ASSISTANT message
    // --------------------------------------------------

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "ASSISTANT",
        content: answer,
      },
    });

    console.log(
      "⏱️ TOTAL:",
      Date.now() - start,
      "ms"
    );

    // --------------------------------------------------
    // 8. Return response
    // --------------------------------------------------

    return NextResponse.json({
      success: true,
      chatId: chat.id,
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