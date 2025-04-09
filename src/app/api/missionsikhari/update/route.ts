import { NextResponse } from "next/server";
import prisma from "@/lib/db";
import { promises as fs } from "fs";
import path from "path";
import { nanoid } from "nanoid"; // For generating unique file names

export async function PATCH(req: Request) {
  try {

    const contentType = req.headers.get("content-type") || "";

    if (!contentType.includes("multipart/form-data")) {
      return NextResponse.json(
        { error: "Invalid content type" },
        { status: 400 }
      );
    }

    const formData = await req.formData();

    const id = formData.get("id");
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
    // Validate that ID is provided and other required fields as necessary

    // Convert work_master_id and id to BigInt

    let updatedData: any = {
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

    };

    if (imgupload) {

      const uploadDir = path.join(process.cwd(), "public/uploads");
      await fs.mkdir(uploadDir, { recursive: true });

      const fileExt = imgupload.name.split(".").pop(); // Extract the file extension
      const uniqueFileName = `${nanoid()}.${fileExt}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      const buffer = await imgupload.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      // Add photo path to the updated data
      updatedData.imgupload = `/uploads/${uniqueFileName}`;
    }

    // Update the record in the database using Prisma
    const updatedDisbursement = await prisma.missionshikari.update({
      where: { id: Number(id) },
      data: updatedData,
    });

    // Convert BigInt fields to string for the response
    const responseData = {
      ...updatedDisbursement,
      id: updatedDisbursement.id.toString(),
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
