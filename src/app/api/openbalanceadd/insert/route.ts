import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        let { open_bal, year_id } = body;

        // Convert open_bal and year_id to numbers
        open_bal = Number(open_bal);
        year_id = Number(year_id); // Ensure year_id is converted to a number

        // Logging the received data for debugging
        console.log('Data received:', { open_bal, year_id });

        // Validate input
        const errorMessages = [];
        if (isNaN(open_bal)) {
            errorMessages.push('Open balance must be a valid number.');
        }
        if (isNaN(year_id)) {
            errorMessages.push('Year ID must be a valid number.');
        }

        if (errorMessages.length > 0) {
            return NextResponse.json({ error: errorMessages.join(' ') }, { status: 400 });
        }

        // Create new entry in the openingBalance table
        const newBankEntry = await prisma.openingBalance.create({
            data: {
                open_bal,
                year_id,
                status: 'Active', // Default status
                update_date_time: new Date(), // Set current datetime
                ins_date_time: new Date(), // Set insert datetime
            },
        });

        // Prepare response data
        const responseData = {
            ...newBankEntry,
            id: newBankEntry.open_bal_id.toString(), // Convert ID to string if needed
        };

        return NextResponse.json(responseData, { status: 201 });
    } catch (error) {
        console.error("Error during insertion:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
