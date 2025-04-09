import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    // Get the request body
    const body = await req.json();
    const {
      id,
      representative_id,
      representative_name,
      number_work,
      genratedworkdate,
      estimatedtotalamount,
      generatednumber,
    } = body;

    // Check if the required fields are provided
    if (
      !id ||
      !representative_id ||
      !representative_name ||
      !number_work ||
      !genratedworkdate ||
      !estimatedtotalamount ||
      !generatednumber
    ) {
      return NextResponse.json(
        { error: "All fields are required" },
        { status: 400 }
      );
    }

    // Parse the incoming data
    const representativeId = parseInt(representative_id);
    const numberwork = parseInt(number_work);
    const generatednumbers = String(generatednumber);
    const parsedDate = new Date(genratedworkdate);
    const formattedDate = parsedDate.toISOString();
    // Update the existing record in the database
    const updatedCategory = await prisma.workMasterDemo.update({
      where: { id: parseInt(id) }, // Use the id to find the record
      data: {
        representative_id: representativeId,
        representative_name: representative_name,
        number_work: numberwork,
        genratedworkdate: formattedDate,
        estimatedtotalamount: estimatedtotalamount,
        generatednumber: generatednumbers,
        type: "workgen", // Assuming type remains unchanged
        status: "Active",
      },
    });

    // Return the updated category with a 200 OK status
    return NextResponse.json(updatedCategory, { status: 200 });
  } catch (error: any) {
    console.error("Error during update:", error); // Log the error for debugging

    // Return a 500 error if something goes wrong
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
