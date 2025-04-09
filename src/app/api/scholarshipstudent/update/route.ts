import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const {
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
            scholarship_name,
            student_scholarship_id
        } = body;

        const schoolid = parseInt(school_id, 10);
        const currentstd = parseInt(current_std, 10);

        // Prepare the update data
        const updateData = {
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
            status: "Active", // Assuming status remains active
            year_add: "2024", // Update this as needed
            admited_in_std: 1, // Update this as needed
            division: "A", // Update this as needed
            first_name: full_name.split(" ")[0], // Extract first name
            middle_name: "", // Handle as needed
            last_name: "", // Handle as needed
            place_of_birth: "", // Handle as needed
            religion: "", // Handle as needed
            scholarship_name
        };

        // Update each student record based on student_scholarship_id
        const updatePromises = student_scholarship_id.map(async (id: any) => {
            return await prisma.tblstudentsscholarship.update({
                where: { student_id: id.toString() }, // Assuming this is the unique identifier
                data: updateData
            });
        });

        // Wait for all updates to complete
        const updatedStudents = await Promise.all(updatePromises);

        return NextResponse.json(updatedStudents, { status: 200 });
    } catch (error) {
        console.error("Error during student update:", error);
        return NextResponse.json(
            { error: "Internal Server Error" },
            { status: 500 }
        );
    }
}
