// pages/api/clusters/updateCluster.ts
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    // Get the data from the request body
    const body = await req.json();
    const { cluster_id, cluster_name } = body;

    // Check if cluster_id and cluster_name are provided
    if (!cluster_id || !cluster_name) {
      return NextResponse.json({ error: 'Cluster ID and name are required' }, { status: 400 });
    }

    // Update the cluster in the database
    const updatedCluster = await prisma.clusterData.update({
      where: { cluster_id }, // Use the provided cluster_id to find the correct record
      data: {
        cluster_name,
        status: "active", // You can update status here if needed
      },
    });

    // Return the updated cluster with a 200 OK status
    return NextResponse.json(updatedCluster, { status: 200 });
  } catch (error: any) {
    console.error("Error during update:", error); // Log the error for debugging

    // Return a 500 error if something goes wrong
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}