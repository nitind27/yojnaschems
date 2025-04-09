import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    // Get the cluster_name from the request body
    const body = await req.json();
    const { category_id, subcategory_id, yojana_id, documents } = body;

    const categoryid = Number(category_id);
    const subcategoryid = Number(subcategory_id);
    const yojanaid = Number(yojana_id);

    // Insert the new cluster into the database
    const newCluster = await prisma.documentYojana.create({
      data: {
        category_id: categoryid,
        subcategory_id: subcategoryid,
        yojana_id: yojanaid,
        documents: documents,
        status: "Active",
        update_date_time: new Date() 
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