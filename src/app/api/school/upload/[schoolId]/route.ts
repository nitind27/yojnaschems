import { NextResponse } from 'next/server';
import prisma from '@/lib/db';
import { promises as fs } from 'fs';
import path from 'path';
import { nanoid } from 'nanoid';

export async function POST(req: Request, { params }: { params: { schoolId: string } }) {
  try {
    const schoolId = parseInt(params.schoolId, 10);
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

    const updatedSchool = await prisma.school.update({
      where: { school_id: schoolId },
      data: { image_urls: imageUrl },
    });

    return NextResponse.json({ image_urls: updatedSchool.image_urls }, { status: 201 });
  } catch (error) {
    console.error("Error during image upload:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
