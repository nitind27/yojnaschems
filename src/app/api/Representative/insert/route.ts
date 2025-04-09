import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name } = body;

    if (!name) {
      return NextResponse.json({ error: 'Cluster name is required' }, { status: 400 });
    }

    const newCluster = await prisma.representative.create({
      data: {
        name: name,
        status: "Active",
      },
    });

    // Convert BigInt fields to string before returning JSON
    const formattedCluster = {
      ...newCluster,
      id: newCluster.id.toString(),
    };

    return NextResponse.json(formattedCluster, { status: 201 });
  } catch (error: any) {
    console.error("Error during insertion:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
