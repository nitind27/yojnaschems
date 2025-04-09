import prisma from '@/lib/db';
import { clippingParents } from '@popperjs/core';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the request body
        const body = await req.json();
        const { beneficiary_id, evaluation_id, amount } = body;

        const beneficiaryid = Number(beneficiary_id);
        const evaluationid = Number(evaluation_id);
        const amountString = String(amount); // Convert amount to string

        const newCategory = await prisma.tbl_evaluation_amount.create({
            data: {
                beneficiary_id: beneficiaryid, // Convert BigInt to string
                evaluation_id: evaluationid, // Ensure it's in ISO-8601 format
                amount: amountString,
                ins_date: new Date(),
                ins_date_time: new Date(),
                verification: "No",
                status: "Active",

            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        console.error("Error during insertion:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
