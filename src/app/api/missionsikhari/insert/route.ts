import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid"; // For generating unique file names

export async function POST(req: Request) {
  try {
    // First, check if the content type is multipart/form-data (file upload)
    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    // Get the form data
    const formData = await req.formData();

    // Extract all fields
    const designation = formData.get("designation");
    const studentname = formData.get("studentname");
    const schoolhosteltype = formData.get("schoolhosteltype");
    const schoolhostelname = formData.get("schoolhostelname");
    const subject = formData.get("subject");
    const testdate = formData.get("testdate");
    const totalmarks = formData.get("totalmarks");
    const obtainmarks = formData.get("obtainmarks");
    const percentage = formData.get("percentage");
    const aadharcard = formData.get("aadharcard");
    const parentsnumber = formData.get("parentsnumber");
    const imgupload = formData.get("imgupload") as File;

    // Ensure 'public/uploads' directory exists
    const uploadDir = 'public/uploads'; // Change to /tmp directory
    await fs.mkdir(uploadDir, { recursive: true });

    let imagePath;
    
    // Check if an image file was uploaded
    if (imgupload) {
      // Generate a unique filename using nanoid
      const fileExt = imgupload.name.split(".").pop(); // Extract the file extension
      const uniqueFileName = `${nanoid()}.${fileExt}`;
      imagePath = `/uploads/${uniqueFileName}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      // Save the file to the local filesystem
      const buffer = await imgupload.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));
    }

    // Insert into the database using Prisma
    const newDisbursement = await prisma.missionshikari.create({
      data: {
        designation: designation?.toString(),
        studentname: studentname?.toString(),
        schoolhosteltype: schoolhosteltype?.toString(),
        schoolhostelname: schoolhostelname?.toString(),
        subject: subject?.toString(),
        testdate: testdate?.toString(),
        totalmarks: totalmarks?.toString(),
        obtainmarks: obtainmarks?.toString(),
        percentage: percentage?.toString(),
        aadharcard: aadharcard?.toString(),
        parentsnumber: parentsnumber?.toString(),
        ...(imagePath && { imgupload: imagePath }), // Conditionally add imgupload only if an image was uploaded
      },
    });

    // Convert BigInt fields to string for the response
    const responseData = {
      ...newDisbursement,
      id: newDisbursement.id,
    };

    return NextResponse.json(responseData, { status: 201 });
  } catch (error) {
    console.error("Error during disbursement creation:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
