import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the request body
        const body = await req.json();
        const { bank_name, ifsc_code, talukaid } = body;

        const taluka_id = Number(talukaid);

        // Check if an entry with the same ifsc_code already exists
        const existingBank = await prisma.tbl_bankmaster.findFirst({
            where: {
                ifsc_code: ifsc_code,
            },
        });

        // If it exists, return a conflict response
        if (existingBank) {
            return NextResponse.json(
                { error: 'IFSC code already exists' },
                { status: 409 }
            );
        }

        // Insert the new category into the database
        const newCategory = await prisma.tbl_bankmaster.create({
            data: {
                bank_name,
                status: "Active",
                ifsc_code,
                talukaid: taluka_id,
            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        console.error("Error during insertion:", error);
        
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
