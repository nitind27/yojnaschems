// import prisma from '@/lib/db'; // Import your Prisma instance
// import { NextResponse } from 'next/server';
// import bcrypt from 'bcrypt';

// export async function PUT(req: Request) {
//   try {
//     const body = await req.json();
//     const { sup_id, sup_name, sup_contact, sup_address, sup_password, category_id, padnam_id, sup_status, imei_number } = body;

//     // Validate input
//     if (!sup_id || !sup_name || !sup_contact || !sup_address || !category_id || !padnam_id) {
//       return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
//     }

//     // Convert category_id and padnam_id to integers
//     const categoryIdInt = parseInt(category_id, 10);
//     const padnamIdInt = parseInt(padnam_id, 10);

//     if (isNaN(categoryIdInt) || isNaN(padnamIdInt)) {
//       return NextResponse.json({ error: 'Invalid category or padnam ID' }, { status: 400 });
//     }

//     // Optionally hash the password only if it's provided and different from the existing one
//     let hashedPassword;
//     if (sup_password) {
//       hashedPassword = await bcrypt.hash(sup_password, 10);
//     }

//     // Update Supervisor entry
//     const updatedSupervisor = await prisma.supervisor.update({
//       where: {
//         sup_id: sup_id,
//       },
//       data: {
//         sup_name,
//         sup_contact,
//         sup_address,
//         ...(sup_password && { sup_password: hashedPassword }), // Only update password if provided
//         category_id: categoryIdInt,  // Use the converted integer
//         padnam_id: padnamIdInt,      // Use the converted integer
//         sup_status: sup_status || 'Active', // Default to 'Active' if not provided
//         imei_number: "",   // Optional field
//       },
//     });

//     return NextResponse.json(updatedSupervisor, { status: 200 });
//   } catch (error) {
//     console.error("Error during update:", error);
//     return NextResponse.json({ error: "Failed to update supervisor" }, { status: 500 });
//   }
// }


import prisma from '@/lib/db'; // Import your Prisma instance
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const { sup_id, sup_name, sup_contact, sup_address, sup_password, category_id, padnam_id, sup_status, imei_number } = body;

    // Validate input
    if (!sup_id || !sup_name || !sup_contact || !sup_address || !category_id || !padnam_id) {
      return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
    }

    // Convert category_id and padnam_id to integers
    const categoryIdInt = parseInt(category_id, 10);
    const padnamIdInt = parseInt(padnam_id, 10);

    if (isNaN(categoryIdInt) || isNaN(padnamIdInt)) {
      return NextResponse.json({ error: 'Invalid category or padnam ID' }, { status: 400 });
    }

    // Update Supervisor entry
    const updatedSupervisor = await prisma.supervisor.update({
      where: {
        sup_id: sup_id,
      },
      data: {
        sup_name,
        sup_contact,
        sup_address,
        sup_password: sup_password || "", // Use plain password, default to empty string if not provided
        category_id: categoryIdInt,  // Use the converted integer
        padnam_id: padnamIdInt,      // Use the converted integer
        sup_status: sup_status || 'Active', // Default to 'Active' if not provided
        imei_number: "",   // Optional field
      },
    });

    return NextResponse.json(updatedSupervisor, { status: 200 });
  } catch (error) {
    console.error("Error during update:", error);
    return NextResponse.json({ error: "Failed to update supervisor" }, { status: 500 });
  }
}
