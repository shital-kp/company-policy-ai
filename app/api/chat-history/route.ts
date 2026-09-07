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
          message: "Temporary employee user not found",
        },
        { status: 500 }
      );
    }

    const chats = await prisma.chat.findMany({
      where: {
        userId: tempUser.id,
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
      // Find user's question
      const question = chat.messages.find(
        (message) => message.role === "USER"
      );

      // Find assistant's answer
      const answer = chat.messages.find(
        (message) => message.role === "ASSISTANT"
      );

      return {
        id: chat.id,
        title: chat.title || "New Chat",
        question: question?.content || "",
        answer: answer?.content || "",
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