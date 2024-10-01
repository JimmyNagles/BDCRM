import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function POST(request) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      website,
      ndaSigned,
      dateSigned,
      introducedBy,
      speakingTo,
      status,
      nextFollowUpDate, // Add this line
    } = body;

    const newClient = await prisma.client.create({
      data: {
        name,
        email,
        phone,
        website,
        ndaSigned,
        dateSigned: dateSigned ? new Date(dateSigned) : null,
        introducedBy,
        speakingTo,
        status,
        nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null, // Add this line
      },
    });

    return NextResponse.json(newClient, { status: 201 });
  } catch (error) {
    console.error("Error creating client:", error);
    return NextResponse.json(
      { error: "Error creating client: " + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}

export async function GET() {
  try {
    const clients = await prisma.client.findMany({
      orderBy: {
        createdAt: "desc",
      },
    });
    return NextResponse.json(clients);
  } catch (error) {
    console.error("Error fetching clients:", error);
    return NextResponse.json(
      { error: "Error fetching clients" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
