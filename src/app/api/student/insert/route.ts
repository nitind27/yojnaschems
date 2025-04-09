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
    } = body;

    // Validate input
    if (
      !serial_number ||
      !full_name ||
      !gr_no ||
      !uid ||
      !school_id ||
      !current_std ||
      !mother_name ||
      !date_of_birth ||
      !gender ||
      !cast ||
      !address ||
      !aadhaar ||
      !contact_no ||
      !sickle_cell
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Convert taluka_id, cluster_id, and other numeric fields to integers
    const schoolid = parseInt(school_id, 10);
    const currentstd = parseInt(current_std, 10);
    // const castId = parseInt(cast, 10);

    // Check if conversion was successful
    if (isNaN(schoolid)) {
      return NextResponse.json(
        { error: "castId ID and Student ID must be valid numbers" },
        { status: 400 }
      );
    }

    // Create new School entry
    const newSchool = await prisma.student.create({
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
        status: "Active", // Default status
        year_add: "2024", // Add appropriate values for required fields
        admited_in_std: 1, // Example value
        division: "A", // Example value
        first_name: full_name.split(" ")[0], // Assuming first name is the first part of full_name
        middle_name: "", // Add appropriate value or handle as needed
        last_name: "", // Add appropriate value or handle as needed
        place_of_birth: "", // Add appropriate value or handle as needed
        religion: "", // Add appropriate value or handle as needed
        // Add other required fields here...
      },
    });
    // Convert BigInt fields to string before sending the response (if applicable)
    const responseData = {
      ...newSchool,
      school_id: newSchool.school_id, // Assuming school_id is a BigInt
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error during school creation:", error);
    // Return specific error message if available
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
