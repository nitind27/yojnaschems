import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the cluster_name from the request body
        const body = await req.json();
        const { representative_id, representative_name, number_work, genratedworkdate, estimatedtotalamount, generatednumber } = body;

        // // Check if cluster_name is provided
        // if (!representative_id || !representative_name || !number_work || !genratedworkdate || !estimatedtotalamount || generatednumber) {
        //     return NextResponse.json({ error: 'All filed required' }, { status: 400 });
        // }

        const representativeId = parseInt(representative_id);
        const numberwork = parseInt(number_work);
        const generatednumbers = String(generatednumber);
       
        const parsedDate = new Date(genratedworkdate);
        const formattedDate = parsedDate.toISOString();
        // Insert the new category into the database
        const newCategory = await prisma.workMasterDemo.create({
            data: {
                representative_id: representativeId,
                representative_name: representative_name,
                number_work: numberwork,
                genratedworkdate: formattedDate,
                estimatedtotalamount: estimatedtotalamount,
                generatednumber: generatednumbers,
                type: "workgen",
                status: "Active",
            },
        });

        // Return the newly created category with a 201 Created status
        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        console.error("Error during insertion:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}