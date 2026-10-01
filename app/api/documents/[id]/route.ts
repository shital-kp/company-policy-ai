import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    req: Request,
    context: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await context.params;

        console.log("Deleting document:", id);

        const document = await prisma.document.findUnique({
            where: {
                id,
            },
        });

        if (!document) {
            return NextResponse.json(
                {
                    success: false,
                    message: "Document not found",
                },
                { status: 404 }
            );
        }

        await prisma.document.delete({
            where: {
                id,
            },
        });

        return NextResponse.json({
            success: true,
            message: "Document deleted successfully",
        });
    } catch (error) {
        console.error("DELETE /api/documents/[id] error:", error);

        return NextResponse.json(
            {
                success: false,
                message:
                    error instanceof Error
                        ? error.message
                        : "Failed to delete document",
            },
            { status: 500 }
        );
    }
}