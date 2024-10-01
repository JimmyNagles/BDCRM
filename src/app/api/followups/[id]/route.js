import { NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request, { params }) {
  const { id } = params;
  try {
    const data = await request.json();
    const updatedFollowUp = await prisma.followUp.update({
      where: { id: id },
      data: {
        date: new Date(data.date),
        type: data.type,
        notes: data.notes,
        nextSteps: data.nextSteps,
      },
      include: {
        client: {
          select: { name: true, email: true },
        },
        user: {
          select: { name: true, email: true },
        },
      },
    });
    return NextResponse.json(updatedFollowUp);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to update follow-up" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  const { id } = params;
  try {
    await prisma.followUp.delete({
      where: { id: id },
    });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to delete follow-up" },
      { status: 500 }
    );
  }
}
