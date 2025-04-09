import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the cluster_name from the request body
        const body = await req.json();
        const { category_name, for_app } = body;

        // Check if cluster_name is provided
        if (!category_name) {
            return NextResponse.json({ error: 'Category name is required' }, { status: 400 });
        }

        // Insert the new category into the database
        const newCategory = await prisma.category.create({
            data: {

                category_name: category_name,
                status: "Active", // Add default status if needed
                for_app: for_app,
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