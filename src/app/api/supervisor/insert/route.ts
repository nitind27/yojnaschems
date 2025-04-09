import prisma from '@/lib/db'; // Import your Prisma instance
import { NextResponse } from 'next/server';
import bcrypt from 'bcrypt';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { sup_name, sup_contact, sup_address, sup_password, category_id, padnam_id, sup_status, imei_number } = body;

    // Validate input
    if (!sup_name || !sup_contact || !sup_address || !sup_password || !category_id || !padnam_id) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Convert category_id and padnam_id to integers
    const categoryIdInt = parseInt(category_id, 10);
    const padnamIdInt = parseInt(padnam_id, 10);

    if (isNaN(categoryIdInt) || isNaN(padnamIdInt)) {
      return NextResponse.json({ error: 'Invalid category or padnam ID' }, { status: 400 });
    }

    // Hash the password
    // const hashedPassword = await bcrypt.hash(sup_password, 10);

    // Create new Supervisor entry
    const newSupervisor = await prisma.supervisor.create({
      data: {
        sup_name,
        sup_contact,
        sup_address,
        sup_password,
        category_id: categoryIdInt, // Use the converted integer
        padnam_id: padnamIdInt,     // Use the converted integer
        sup_status: sup_status || 'Active', // Default to 'Active' if not provided
        imei_number: '',   // Optional field
      },
    });

    return NextResponse.json(newSupervisor, { status: 201 });
  } catch (error) {
    console.error("Error during insertion:", error);
    return NextResponse.json({ error: "Failed to insert supervisor" }, { status: 500 });
  }
}
