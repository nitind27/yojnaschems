import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        console.log('Received body:', body); // Log received body

        const { id, name, account_no, yojana_year_id, amount } = body;

        // Validate input
        if (!id || !account_no || !amount || !name || !yojana_year_id) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Convert yojana_year_id to an integer
        const yojanaYearIdInt = parseInt(yojana_year_id, 10);
        if (isNaN(yojanaYearIdInt)) {
            return NextResponse.json({ error: 'Invalid yojana_year_id' }, { status: 400 });
        }

        // Update Village entry
        const updatedVillage = await prisma.bank.update({
            where: { id: Number(id) }, // Convert id to number if it's a string
            data: {
                account_no,
                amount,
                name,
                yojana_year_id: yojanaYearIdInt, // Use the converted integer
                status: 'Active', // Default status or whatever logic you need
                update_date_time: new Date(), // Update to current datetime
            },
        });

        // Prepare response data
        const responseData = {
            ...updatedVillage,
            id: updatedVillage.id.toString(), // Convert BigInt to string
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error during update:", error);
        
        // Return a response for any internal server errors
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
