
import { NextResponse } from "next/server";
import { searchSimilarChunks } from "@/lib/ai/vectorSearch";
import { generateAnswer } from "@/lib/ai/generateAnswer";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function POST(req: Request) {
  const start = Date.now();

  try {
    // ==========================================
    // 1. Get logged-in user
    // ==========================================

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    console.log("👤 Logged-in user:", userId);

    // ==========================================
    // 2. Read request
    // ==========================================

    const body = await req.json();

    const question = body.question?.trim();
    const chatId = body.chatId?.trim();

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
    console.log("💬 Chat ID:", chatId || "NEW CHAT");
    console.log("👤 User ID:", userId);
    console.log("==========================================");

    // ==========================================
    // 3. Find existing chat OR create new chat
    // ==========================================

    let chat;

    if (chatId) {
      // ----------------------------------------
      // Existing conversation
      // ----------------------------------------

      chat = await prisma.chat.findFirst({
        where: {
          id: chatId,
          userId: userId,
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

      console.log("💬 Existing chat:", chat.id);
    } else {
      // ----------------------------------------
      // New conversation
      // ----------------------------------------

      chat = await prisma.chat.create({
        data: {
          userId: userId,
          title:
            question.length > 50
              ? question.substring(0, 50) + "..."
              : question,
        },
      });

      console.log(
        "🆕 New chat created:",
        chat.id
      );
    }

    // ==========================================
    // 4. Save USER message
    // ==========================================

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "USER",
        content: question,
      },
    });

    console.log("💾 User question saved");

    // ==========================================
    // 5. Vector search
    // ==========================================

    const searchStart = Date.now();

    const chunks = await searchSimilarChunks(
      question,
      1
    );

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
    // 6. Log retrieved chunks
    // ==========================================

    chunks.forEach((chunk, index) => {
      console.log(
        `\n--- CHUNK ${index + 1} ---`
      );

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
    // 7. No relevant policy found
    // ==========================================

    if (chunks.length === 0) {
      const answer =
        "I could not find this information in the available company policies.";

      console.log(
        "⚠️ No relevant policy chunks found"
      );

      await prisma.chatMessage.create({
        data: {
          chatId: chat.id,
          role: "ASSISTANT",
          content: answer,
        },
      });

      await prisma.chat.update({
        where: {
          id: chat.id,
        },
        data: {
          updatedAt: new Date(),
        },
      });

      console.log(
        "💾 Assistant answer saved"
      );

      console.log(
        "⏱️ TOTAL:",
        Date.now() - start,
        "ms"
      );

      return NextResponse.json({
        success: true,
        chatId: chat.id,
        question,
        answer,
        sources: [],
      });
    }

    // ==========================================
    // 8. Build context
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
    // 9. Generate answer using Qwen
    // ==========================================

    const aiStart = Date.now();

    const answer = await generateAnswer({
      question,
      context,
    });

    const generationTime =
      Date.now() - aiStart;

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
    // 10. Save ASSISTANT message
    // ==========================================

    await prisma.chatMessage.create({
      data: {
        chatId: chat.id,
        role: "ASSISTANT",
        content: answer,
      },
    });

    console.log(
      "💾 Assistant answer saved"
    );

    // ==========================================
    // 11. Update chat timestamp
    // ==========================================

    await prisma.chat.update({
      where: {
        id: chat.id,
      },
      data: {
        updatedAt: new Date(),
      },
    });

    // ==========================================
    // 12. Total time
    // ==========================================

    console.log(
      "⏱️ TOTAL:",
      Date.now() - start,
      "ms"
    );

    // ==========================================
    // 13. Return response
    // ==========================================

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
