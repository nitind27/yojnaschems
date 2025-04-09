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


    const studentData = student_scholarship_id.map((id: { toString: () => any; }) => ({
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
      status: "Active", // Default status
      year_add: "2024", // Add appropriate values for required fields
      admited_in_std: 1, // Example value
      division: "A", // Example value
      first_name: full_name.split(" ")[0], // Assuming first name is the first part of full_name
      middle_name: "", // Add appropriate value or handle as needed
      last_name: "", // Add appropriate value or handle as needed
      place_of_birth: "", // Add appropriate value or handle as needed
      religion: "", // Add appropriate value or handle as needed
      scholarship_name,
      student_scholarship_id: id.toString() // Convert each ID to string
    }));

    // Create new entries in the database
    const newStudents = await prisma.tblstudentsscholarship.createMany({
        data: studentData
    });

    return NextResponse.json(newStudents, { status: 201 });
  } catch (error) {
    console.error("Error during student creation:", error);
    return NextResponse.json(
        { error:  "Internal Server Error" },
        { status: 500 }
    );
  }
}
