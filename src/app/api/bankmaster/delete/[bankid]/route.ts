import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { bankid: string } }) {
  const { bankid } = params;
  const { status } = await req.json(); // Get new status from request body

  try {
    // Update the cluster's status
    await prisma.tbl_bankmaster.update({
      where: { id: Number(bankid) },
      data: { status }, // Update with new status
    });

    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error("Error during status update:", error);

    if (error.code === 'P2025') {
      return NextResponse.json({ error: 'Cluster not found' }, { status: 404 });
    }

    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}