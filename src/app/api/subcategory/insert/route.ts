import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the cluster_name from the request body
        const body = await req.json();
        const { category_id, sub_category_name, yojana_year_id, bank_id, amount } = body;

        // Check if cluster_name is provided
        if (!category_id || !sub_category_name || !yojana_year_id || !bank_id || !amount) {
            return NextResponse.json({ error: 'All filed required' }, { status: 400 });
        }

        const categoryid = parseInt(category_id, 10);
        const bankid = parseInt(bank_id, 10);
        const yojanayearid = parseInt(yojana_year_id, 10);
        // Insert the new category into the database
        const newCategory = await prisma.subCategory.create({
            data: {
                category_id: categoryid,
                sub_category_name: sub_category_name,
                yojana_year_id: yojanayearid,
                bank_id: bankid,
                amount: amount,
                status: "Active", // Add default status if needed
                created_at: new Date(), // Set to current date/time
                updated_at: new Date(),  // Set to current date/time
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