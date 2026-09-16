import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Temporary user until authentication is implemented
    const tempUser = await prisma.user.findUnique({
      where: {
        email: "employee@company.com",
      },
    });

    if (!tempUser) {
      return NextResponse.json(
        {
          message:
            "Temporary employee user not found",
        },
        { status: 500 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: tempUser.id,
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

    const history = chats.map((chat) => {
      const question = chat.messages.find(
        (message) =>
          message.role === "USER"
      );

      const answer = chat.messages.find(
        (message) =>
          message.role === "ASSISTANT"
      );

      return {
        id: chat.id,
        title:
          chat.title || "New Chat",
        question:
          question?.content || "",
        answer:
          answer?.content || "",
        time: chat.updatedAt,
      };
    });

    console.log(
      "📚 Chat history count:",
      history.length
    );

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
        message:
          "Failed to fetch chat history",
        error:
          error instanceof Error
            ? error.message
            : String(error),
      },
      { status: 500 }
    );
  }
}