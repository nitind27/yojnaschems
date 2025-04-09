import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the request body as JSON
        const body = await req.json();
        console.log('Request Body:', body); 

        const {
            member_id,
            beneficiary_id,
            surname,
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

        // Update the existing beneficiary in the database
        const updatedBeneficiary = await prisma.tbl_members.update({
            where: { member_id }, // Find beneficiary by unique identifier
            data: {
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
                status: "Active", // You can adjust this if needed
            },
        });

        console.log('Beneficiary Updated:', updatedBeneficiary); // Log the updated beneficiary

        // Return the updated beneficiary with a 200 OK status
        return NextResponse.json(updatedBeneficiary, { status: 200 });
    } catch (error) {
        console.error("Error during update:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
