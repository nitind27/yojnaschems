import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    // Get the data from the request body
    const body = await req.json();
    const { id, name } = body;

    // Check if cluster_id and cluster_name are provided
    if (!id || !name) {
      return NextResponse.json({ error: 'Cluster ID and name are required' }, { status: 400 });
    }

    // Update the cluster in the database
    const updatedCluster = await prisma.representative.update({
      where: { id: BigInt(id) },  // Ensure BigInt conversion here
      data: {
        name,
        status: "active", // Update status if needed
      },
    });

    // Convert BigInt fields to string before sending the response
    const updatedClusterWithStringId = {
      ...updatedCluster,
      id: updatedCluster.id.toString() // Convert BigInt to string
    };

    // Return the updated cluster with a 200 OK status
    return NextResponse.json(updatedClusterWithStringId, { status: 200 });
  } catch (error: any) {
    console.error("Error during update:", error); // Log the error for debugging

    // Return a 500 error if something goes wrong
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
