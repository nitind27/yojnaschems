import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, account_no, yojana_year_id, amount } = body;

        // Validate input
        if (!account_no || !amount || !name || !yojana_year_id) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Convert yojana_year_id to an integer
        const yojanaYearIdInt = parseInt(yojana_year_id, 10);
        if (isNaN(yojanaYearIdInt)) {
            return NextResponse.json({ error: 'Invalid yojana_year_id' }, { status: 400 });
        }

        // Create new Village entry
        const newVillage = await prisma.bank.create({
            data: {
                account_no,
                amount,
                name,
                yojana_year_id: yojanaYearIdInt, // Use the converted integer
                status: 'Active', // Default status
                update_date_time: new Date(), // Set current datetime
            },
        });

        // Prepare response data
        const responseData = {
            ...newVillage,
            id: newVillage.id.toString(), // Convert BigInt to string
        };

        return NextResponse.json(responseData, { status: 201 });
    } catch (error) {
        console.error("Error during insertion:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
