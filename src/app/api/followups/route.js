import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const clientId = searchParams.get("clientId");

  if (!clientId) {
    return NextResponse.json(
      { error: "Client ID is required" },
      { status: 400 }
    );
  }

  try {
    const followUps = await prisma.followUp.findMany({
      where: { clientId: clientId },
      include: {
        client: {
          select: { name: true, email: true },
        },
      },
      orderBy: { date: "desc" },
    });

    if (followUps.length === 0) {
      return NextResponse.json(
        { message: "No follow-ups found for this client" },
        { status: 200 }
      );
    }

    return NextResponse.json(followUps);
  } catch (error) {
    console.error("Error fetching follow-ups:", error);
    return NextResponse.json(
      { error: "Failed to fetch follow-ups" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const data = await request.json();

    if (!data.clientId) {
      return NextResponse.json(
        { error: "Client ID is required" },
        { status: 400 }
      );
    }

    const newFollowUp = await prisma.followUp.create({
      data: {
        clientId: data.clientId,
        date: new Date(),
        type: data.type,
        notes: data.notes,
        nextSteps: data.nextSteps,
        userId: data.userId,
      },
      include: {
        client: {
          select: { name: true, email: true },
        },
      },
    });

    return NextResponse.json(newFollowUp, { status: 201 });
  } catch (error) {
    console.error("Error creating follow-up:", error);
    return NextResponse.json(
      { error: "Failed to create follow-up" },
      { status: 500 }
    );
  }
}
