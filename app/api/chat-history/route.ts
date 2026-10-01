
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

    // ==========================================
    // 2. Get chats for this user only
    //    Fetch only the data required by the UI
    // ==========================================

    const chats = await prisma.chat.findMany({
      where: {
        userId,
      },

      orderBy: {
        updatedAt: "desc",
      },

      select: {
        id: true,
        title: true,
        updatedAt: true,

        messages: {
          where: {
            role: {
              in: ["USER", "ASSISTANT"],
            },
          },

          orderBy: {
            createdAt: "asc",
          },

          select: {
            role: true,
            content: true,
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
    console.error("❌ Chat history error:", error);

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

