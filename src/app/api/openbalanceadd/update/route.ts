import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        let { open_bal, year_id, open_bal_id } = body;

        // Convert open_bal and year_id to numbers
        open_bal = Number(open_bal);
        year_id = Number(year_id);

        // Log the received data
        console.log('Data received for update:', { open_bal, year_id, open_bal_id });

        // Validate input
        if (!open_bal_id) {
            return NextResponse.json({ error: 'open_bal_id is required' }, { status: 400 });
        }

        // Update existing entry in the openingBalance table
        const updatedBankEntry = await prisma.openingBalance.update({
            where: { open_bal_id }, // Ensure you're passing the correct identifier
            data: {
                open_bal,
                year_id,
                update_date_time: new Date(),
            },
        });

        // Prepare response data
        const responseData = {
            ...updatedBankEntry,
            id: updatedBankEntry.open_bal_id.toString(), // Convert ID to string if needed
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error during update:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
