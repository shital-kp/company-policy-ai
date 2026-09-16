import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
  request: Request,
  {
    params,
  }: {
    params: Promise<{ chatId: string }>;
  }
) {
  try {
    const { chatId } = await params;

    if (!chatId) {
      return NextResponse.json(
        {
          success: false,
          message: "Chat ID is required",
        },
        { status: 400 }
      );
    }

    // Check chat exists
    const chat = await prisma.chat.findUnique({
      where: {
        id: chatId,
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

    // Delete chat
    // ChatMessage records will also be deleted
    // if your Prisma relation uses onDelete: Cascade.
    await prisma.chat.delete({
      where: {
        id: chatId,
      },
    });

    console.log(
      "🗑️ Chat deleted:",
      chatId
    );

    return NextResponse.json({
      success: true,
      message: "Chat deleted successfully",
    });
  } catch (error) {
    console.error(
      "❌ Delete chat error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          error instanceof Error
            ? error.message
            : "Failed to delete chat",
      },
      { status: 500 }
    );
  }
}