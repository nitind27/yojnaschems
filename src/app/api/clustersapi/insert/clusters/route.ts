import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Get the cluster_name from the request body
    const body = await req.json();
    const { cluster_name } = body;

    // Check if cluster_name is provided
    if (!cluster_name) {
      return NextResponse.json({ error: 'Cluster name is required' }, { status: 400 });
    }

    // Insert the new cluster into the database
    const newCluster = await prisma.clusterData.create({
      data: {
        cluster_name: cluster_name,
        status: "Active", // Add default status if needed
        update_date_time: new Date() // Set to current date/time or any valid Date object
      },
    });

    // Return the newly created cluster with a 201 Created status
    return NextResponse.json(newCluster, { status: 201 });
  } catch (error: any) {
    console.error("Error during insertion:", error); // Log the error for debugging

    // Return a 500 error if something goes wrong
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}