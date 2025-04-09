import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    // Validate input
    if (!name) {
      return NextResponse.json({ error: 'Name is required' }, { status: 400 });
    }

    // Create new Taluka entry
    const newTaluka = await prisma.talukasData.create({
      data: {
        name,
        name_marathi: 'fasfd', // Example Marathi name
        status: 'Active', // Default status
      },
    });

    // Convert BigInt fields to string before sending the response
    const responseData = {
      ...newTaluka,
      id: newTaluka.id.toString(), // Assuming id is a BigInt
      // Convert other BigInt fields if necessary
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error during insertion:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}