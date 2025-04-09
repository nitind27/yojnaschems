import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { supervisor: string } }) {
  const { supervisor } = params;
  const { sup_status } = await req.json(); // Get new status from request body

  try {
    // Update the cluster's status
    await prisma.supervisor.update({
      where: { sup_id: Number(supervisor) },
      data: { sup_status }, // Update with new status
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error during status update:", error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Supervisor not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}