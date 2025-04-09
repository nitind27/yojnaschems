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
    const notifications_type = formData.get("notifications_type");
    const details = formData.get("details");
    const links = formData.get("links");
    const new_icon = formData.get("new_icon");
    const header = formData.get("header");
    const photoFile = formData.get("img") as File;

    // Validate the fields (ensure all required fields are present)
    if (
      !notifications_type ||
      !details ||
      !links ||
      !new_icon ||
      !header ||
      !photoFile
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }

    // Ensure 'public/uploads' directory exists
    const uploadDir = '/tmp'; // Change to /tmp directory

    await fs.mkdir(uploadDir, { recursive: true });

    // Generate a unique filename using nanoid
    const fileExt = photoFile.name.split(".").pop(); // Extract the file extension
    const uniqueFileName = `${nanoid()}.${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    // Save the file to the local filesystem
    const buffer = await photoFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));

    // Insert into the database using Prisma
    const newDisbursement = await prisma.notification.create({
      data: {
        notifications_type: notifications_type.toString(),
        details: details.toString(),
        links: links.toString(),
        new_icon: new_icon.toString(),
        img: `/uploads/${uniqueFileName}`, // Store the relative path of the uploaded image
        header: header.toString(),
        status: "Start",
      },
    });

    // Convert BigInt fields to string for the response
    const responseData = {
      ...newDisbursement,
      notifi_id: newDisbursement.notifi_id.toString(),
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
