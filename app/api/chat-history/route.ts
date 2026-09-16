
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export async function GET() {
  try {
    // ==========================================
    // 1. Get logged-in user
    // ==========================================

    const session = await auth();

    if (!session?.user?.id) {
      return NextResponse.json(
        {
          message: "Unauthorized",
        },
        { status: 401 }
      );
    }

    const userId = session.user.id;

    console.log("Chat history user:", userId);

    // ==========================================
    // 2. Get chats for this user only
    // ==========================================

    const chats = await prisma.chat.findMany({
      where: {
        userId: userId,
      },

      orderBy: {
        updatedAt: "desc",
      },

      include: {
        messages: {
          orderBy: {
            createdAt: "asc",
          },
        },
      },
    });

    // ==========================================
    // 3. Format chat history
    // ==========================================

    const history = chats.map((chat) => {
      const question = chat.messages.find(
        (message) => message.role === "USER"
      );

      const answer = chat.messages.find(
        (message) => message.role === "ASSISTANT"
      );

      return {
        id: chat.id,
        title: chat.title || "New Chat",
        question: question?.content || "",
        answer: answer?.content || "",
        time: chat.updatedAt,
      };
    });

    console.log(
      "Chat history count:",
      history.length
    );

    // ==========================================
    // 4. Return history
    // ==========================================

    return NextResponse.json(
      {
        chats: history,
      },
      {
        headers: {
          "Cache-Control":
            "no-store, no-cache, must-revalidate",
        },
      }
    );
  } catch (error) {
    console.error(
      "❌ Chat history error:",
      error
    );

    return NextResponse.json(
      {
        message: "Failed to fetch chat history",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}
