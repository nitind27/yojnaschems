import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        // Get the request body
        const body = await req.json();
        const { parivahan_id, parivahan_date, outward_no, sup_id,parivahan_no, yojana_year_id, yojana_type, yojana_id, beneficiary_id } = body;


        const formattedDate = new Date(parivahan_date);
        if (isNaN(formattedDate.getTime())) {
            throw new Error('Invalid date format. Please provide a valid ISO-8601 date.');
        }
        
        
        const supIdNumber = Number(sup_id);
        const yojana_yearid = Number(yojana_year_id);
        const yojanaid = Number(yojana_id);
        const beneficiaryid = beneficiary_id.toString();
console.log("fsdafsdfa",parivahan_no)
        // Update the existing record based on the provided ID
        const updatedCategory = await prisma.tblparivahan.update({
            where: { parivahan_id: parivahan_id }, // Use the ID to find the record to update
            data: {
                parivahan_no: BigInt(parivahan_no), // Convert BigInt to string
                parivahan_date: formattedDate.toISOString(), // Ensure it's in ISO-8601 format
                outward_no,
                sup_id: supIdNumber,
                yojana_year_id: yojana_yearid,
                yojana_type,
                yojana_id: yojanaid,
                beneficiary_id: beneficiaryid,
                status: "Active", // Default status (you could make this dynamic if needed)
                ins_date: new Date().toISOString() // Add actual update date if needed
            },
        });

        // Convert BigInt fields to string if necessary before returning
        return NextResponse.json({
            ...updatedCategory,
            parivahan_no: updatedCategory.parivahan_no.toString() // Convert BigInt to string for response
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error during update:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
