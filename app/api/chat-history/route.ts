import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

const TEMP_USER_ID = "your-user-id";

export async function GET() {
  try {
    const chats = await prisma.chat.findMany({
      where: {
        userId: TEMP_USER_ID,
      },
      orderBy: {
        createdAt: "desc",
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
        (message) => message.role === "USER"
      );

      return {
        id: chat.id,
        title: chat.title || "New Chat",
        question: question?.content || "",
        time: chat.createdAt,
      };
    });

    return NextResponse.json({
      chats: history,
    });
  } catch (error) {
    console.error("Chat history error:", error);

    return NextResponse.json(
      {
        message: "Failed to fetch chat history",
        error: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}