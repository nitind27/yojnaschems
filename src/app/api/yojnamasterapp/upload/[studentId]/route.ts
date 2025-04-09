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
    const photoFiles = formData.getAll('yojna_img') as File[];

    if (!photoFiles || photoFiles.length === 0) {
      return NextResponse.json({ error: 'At least one photo file is required' }, { status: 400 });
    }

    if (photoFiles.length > 3) {
      return NextResponse.json({ error: 'Maximum 3 images are allowed' }, { status: 400 });
    }

    const uploadDir = path.join(process.cwd(), 'public/uploads');
    await fs.mkdir(uploadDir, { recursive: true });

    const imageUrls: string[] = [];

    for (const photoFile of photoFiles) {
      const fileExt = photoFile.name.split('.').pop();
      const uniqueFileName = `${nanoid()}.${fileExt}`;
      const filePath = path.join(uploadDir, uniqueFileName);

      const buffer = await photoFile.arrayBuffer();
      await fs.writeFile(filePath, Buffer.from(buffer));

      imageUrls.push(`/uploads/${uniqueFileName}`);
    }

    // Retrieve existing image URLs from the database
    const existingYojana = await prisma.yojanaMasterApp.findUnique({
      where: { yojana_id: studentId },
    });

    let existingImageUrls: string[] = [];
    if (existingYojana && existingYojana.yojna_img) {
      existingImageUrls = existingYojana.yojna_img.split(',');
    }

    // Combine existing and new image URLs, limiting to a maximum of 3
    const combinedImageUrls = [...existingImageUrls, ...imageUrls].slice(0, 3);
    const imageUrlString = combinedImageUrls.join(',');

    const updatedSchool = await prisma.yojanaMasterApp.update({
      where: { yojana_id: studentId },
      data: { yojna_img: imageUrlString },
    });

    return NextResponse.json({ image_urls: updatedSchool.yojna_img }, { status: 201 });

  } catch (error) {
    console.error("Error during image upload:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
