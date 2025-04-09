import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the request body as JSON
        const body = await req.json();
        console.log('Request Body:', body); // Log the incoming request body

        // Destructure and parse values from the request body
        const {
            surname,
            beneficiary_id,
            firstname,
            middlename,
            fullname,
            designation,
            caste_id,
            beneficiary_type,
            ration_no,
            aadhar_no,
            mobile_no,


        } = body;

        const casteid = parseInt(caste_id, 10) || 0;
        // Insert the new beneficiary into the database
        const newBeneficiary = await prisma.tbl_members.create({
            data: {
                beneficiary_id,
                surname,
                firstname,
                middlename,
                fullname,
                designation,
                caste_id: casteid,
                beneficiary_type,
                ration_no,
                aadhar_no,
                mobile_no,
                status: "Active",


            },
        });

        console.log('New Beneficiary Created:', newBeneficiary); // Log the newly created beneficiary

        // Return the newly created beneficiary with a 201 Created status
        return NextResponse.json(newBeneficiary, { status: 201 });
    } catch (error) {
        console.error("Error during insertion:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}