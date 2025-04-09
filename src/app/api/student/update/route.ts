import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            student_id,
            serial_number,
            full_name,
            gr_no,
            uid,
            school_id,
            current_std,
            mother_name,
            date_of_birth,
            gender,
            cast,
            aadhaar,
            address,
            contact_no,
            sickle_cell,
            sickle_report,
        } = body;

        // Validate input
        // if (
        //     !student_id ||
        //     !serial_number ||
        //     !full_name ||
        //     !gr_no ||
        //     !uid ||
        //     !school_id ||
        //     !current_std ||
        //     !mother_name ||
        //     !date_of_birth ||
        //     !gender ||
        //     !cast ||
        //     !address ||
        //     !aadhaar ||
        //     !contact_no ||
        //     !sickle_cell
        // ) {
        //     return NextResponse.json(
        //         { error: "All required fields must be filled" },
        //         { status: 400 }
        //     );
        // }

        // Convert school_id and current_std to integers
        const schoolid = parseInt(school_id, 10);
        const currentstd = parseInt(current_std, 10);

        // Check if conversion was successful
        if (isNaN(schoolid) || isNaN(currentstd)) {
            return NextResponse.json(
                { error: "School ID and Current Standard must be valid numbers" },
                { status: 400 }
            );
        }

        // Update existing student entry
        const updatedStudent = await prisma.student.update({
            where: { student_id: parseInt(student_id, 10) }, // Assuming serial_number is unique
            data: {
                serial_number,
                full_name,
                gr_no,
                uid,
                school_id: schoolid,
                current_std: currentstd,
                mother_name,
                date_of_birth,
                gender,
                cast,
                aadhaar,
                address,
                contact_no,
                sickle_cell,
                sickle_report,
                // You can add other fields that you want to update here
            },
        });

        // Convert BigInt fields to string before sending the response (if applicable)
        const responseData = {
            ...updatedStudent,
            school_id: updatedStudent.school_id, // Assuming school_id is a BigInt
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error during student update:", error);
        return NextResponse.json(
            { error: error || "Internal Server Error" },
            { status: 500 }
        );
    }
}