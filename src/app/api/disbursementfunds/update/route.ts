import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid'; // For generating unique file names

export async function PATCH(req: Request) {
  try {
    // First, check if the content type is multipart/form-data (file upload)
    const contentType = req.headers.get('content-type') || '';
    
    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    // Get the form data
    const formData = await req.formData();

    // Extract all fields including the ID of the record to update
    const id = formData.get('id');
    const work_master_id = formData.get('work_master_id');
    const date = formData.get('date');
    const installment = formData.get('installment');
    const amount = formData.get('amount');
    const latitude = formData.get('latitude');
    const longitude = formData.get('longitude');
    const address = formData.get('address');
    const photoFile = formData.get('photo') as File;

    // Validate that ID is provided and other required fields as necessary
    if (!id || !work_master_id || !date || !installment || !amount || !latitude || !longitude || !address) {
      return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
    }

    // Convert work_master_id and id to BigInt
    const workmasterid = BigInt(work_master_id as any);
    const recordId = BigInt(id as any);

    let updatedData: any = {
      work_master_id: workmasterid,
      date: new Date(date as any).toISOString(),
      installment: installment.toString(),
      amount: parseFloat(amount.toString()),
      latitude: latitude.toString(),
      longitude: longitude.toString(),
      address: address.toString(),
      status: 'Active',
    };

    // If a new photo file is uploaded, handle file storage and update the photo path
    if (photoFile) {
      // Ensure 'public/uploads' directory exists
      const uploadDir = path.join(process.cwd(), 'public/uploads');
      await fs.mkdir(uploadDir, { recursive: true });

      // Generate a unique filename using nanoid
      const fileExt = photoFile.name.split('.').pop(); // Extract the file extension
      const uniqueFileName = `${nanoid()}.${fileExt}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      // Save the new file to the local filesystem
      const buffer = await photoFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      // Add photo path to the updated data
      updatedData.photo = `/uploads/${uniqueFileName}`;
    }

    // Update the record in the database using Prisma
    const updatedDisbursement = await prisma.nidhiVitaran.update({
      where: { id: recordId },
      data: updatedData,
    });

    // Convert BigInt fields to string for the response
    const responseData = {
      ...updatedDisbursement,
      id: updatedDisbursement.id.toString(),
      work_master_id: updatedDisbursement.work_master_id.toString(),
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Error during disbursement update:", error);
    return NextResponse.json({ error: error || 'Internal Server Error' }, { status: 500 });
  }
}
