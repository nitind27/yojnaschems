// pages/api/clusters/updateCluster.ts
import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        // Get the data from the request body
        const body = await req.json();
        const { sub_category_id, category_id, sub_category_name, yojana_year_id, bank_id, amount } = body;

        if (!category_id || !sub_category_name || !yojana_year_id || !bank_id || !amount) {
            return NextResponse.json({ error: 'All filed required' }, { status: 400 });
        }
        const categoryid = parseInt(category_id, 10);
        const bankid = parseInt(bank_id, 10);
        const yojanayearid = parseInt(yojana_year_id, 10);
        // Update the cluster in the database
        const updatedCluster = await prisma.subCategory.update({
            where: { sub_category_id }, // Use the provided cluster_id to find the correct record
            data: {
                category_id: categoryid,
                sub_category_name,
                yojana_year_id: yojanayearid,
                bank_id: bankid,
                amount,
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