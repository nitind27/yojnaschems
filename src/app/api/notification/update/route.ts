import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid"; // For generating unique file names

export async function PATCH(req: Request) {
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

    // Extract all fields including the ID of the record to update
    const notifi_id = formData.get("notifi_id");
    const notifications_type = formData.get("notifications_type");
    const details = formData.get("details");
    const links = formData.get("links");
    const new_icon = formData.get("new_icon");
    const header = formData.get("header");
    const photoFile = formData.get("img") as File;
    const recordId = Number(notifi_id as any);
    // Validate that ID is provided and other required fields as necessary
    if (
      !notifications_type ||
      !details ||
      !links ||
      !new_icon ||
      !header
    ) {
      return NextResponse.json(
        { error: "All required fields must be filled" },
        { status: 400 }
      );
    }
    // Convert work_master_id and id to BigInt

    let updatedData: any = {
      notifications_type: notifications_type.toString(),
      details: details.toString(),
      links: links.toString(),
      new_icon: new_icon.toString(),
      header: header.toString(),
      status: "Start",
    };

    // If a new photo file is uploaded, hanfasdfedle file storage and update the photo path
    if (photoFile) {
      // Ensure 'public/uploads' directory exists
      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate a unique filename using nanoid
      const fileExt = photoFile.name.split(".").pop(); // Extract the file extension
      const uniqueFileName = `${nanoid()}.${fileExt}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      // Save the new file to the local filesystem
      const buffer = await photoFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      // Add photo path to the updated data
      updatedData.img = `/uploads/${uniqueFileName}`;
    }

    // Update the record in the database using Prisma
    const updatedDisbursement = await prisma.notification.update({
      where: { notifi_id: recordId },
      data: updatedData,
    });

    // Convert BigInt fields to string for the response
    const responseData = {
      ...updatedDisbursement,
      notifi_id: updatedDisbursement.notifi_id.toString(),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error during disbursement update:", error);
    return NextResponse.json(
      { error: error || "Internal Server Error" },
      { status: 500 }
    );
  }
}
