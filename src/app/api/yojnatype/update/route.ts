// pages/api/clusters/updateCluster.ts
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        // Get the data from the request body
        const body = await req.json();
        const { yojana_type_id, category_id, sub_category_id, yojana_type } = body;

        // Check if cluster_name is provided
        if (!category_id || !sub_category_id || !yojana_type) {
            return NextResponse.json({ error: 'All filed required' }, { status: 400 });
        }
        const categoryid = parseInt(category_id, 10);
        const subcategoryid = parseInt(sub_category_id, 10);
        // Update the cluster in the database
        const updatedCluster = await prisma.yojnatype.update({
            where: { yojana_type_id }, // Use the provided cluster_id to find the correct record
            data: {
                category_id: categoryid,
                sub_category_id:subcategoryid,
                yojana_type,
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