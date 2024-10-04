import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

export async function PATCH(request, { params }) {
  try {
    const { id } = params;
    const body = await request.json();

    // Extract the analysisResult string from the request body
    const { analysisResult } = body;

    if (!analysisResult || typeof analysisResult !== "string") {
      throw new Error("Invalid analysisResult. Must be a non-empty string.");
    }

    const updatedClient = await prisma.client.update({
      where: { id },
      data: {
        analysisResult, // Use the analysisResult value passed from the front-end
      },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error("Error updating analysisResult:", error);
    return NextResponse.json(
      { error: "Error updating analysisResult: " + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function PUT(request, { params }) {
  try {
    const { id } = params;
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
      nextFollowUpDate,
    } = body;

    const updatedClient = await prisma.client.update({
      where: { id: id },
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
        nextFollowUpDate: nextFollowUpDate ? new Date(nextFollowUpDate) : null,
      },
    });

    return NextResponse.json(updatedClient, { status: 200 });
  } catch (error) {
    console.error("Error updating client:", error);
    return NextResponse.json(
      { error: "Error updating client: " + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
export async function GET(request, { params }) {
  try {
    const { id } = params;
    const client = await prisma.client.findUnique({
      where: { id: id },
    });

    if (!client) {
      return NextResponse.json({ error: "Client not found" }, { status: 404 });
    }

    return NextResponse.json(client);
  } catch (error) {
    console.error("Error fetching client:", error);
    return NextResponse.json(
      { error: "Error fetching client: " + error.message },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
