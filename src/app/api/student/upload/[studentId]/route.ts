import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

export async function POST(req: Request, { params }: { params: { studentId: string } }) {
  try {
    const studentId = parseInt(params.studentId, 10);
    const contentType = req.headers.get('content-type') || '';

    if (!contentType.includes('multipart/form-data')) {
      return NextResponse.json({ error: 'Invalid content type' }, { status: 400 });
    }

    const formData = await req.formData();
    const photoFile = formData.get('photo') as File;

    if (!photoFile) {
      return NextResponse.json({ error: 'Photo file is required' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const fileExt = photoFile.name.split('.').pop();
    const uniqueFileName = `${nanoid()}.${fileExt}`;
    const filePath = path.join(uploadDir, uniqueFileName);

    const buffer = await photoFile.arrayBuffer();
    await fs.writeFile(filePath, Buffer.from(buffer));

    const imageUrl = `/uploads/${uniqueFileName}`;

    const updatedSchool = await prisma.student.update({
      where: { student_id: studentId },
      data: { profile_photo: imageUrl },
    });

    return NextResponse.json({ image_urls: updatedSchool.profile_photo }, { status: 201 });
  } catch (error) {
    console.error("Error during image upload:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
