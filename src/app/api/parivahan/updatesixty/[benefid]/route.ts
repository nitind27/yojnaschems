import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { benefid: string } }) {
    const { benefid } = params;
    const { sixty } = await req.json(); // Get new status from request body

    try {
        // Update the cluster's status
        await prisma.beneficiary.update({
            where: { beneficiary_id: Number(benefid) },
            data: { sixty }, // Update with new status
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