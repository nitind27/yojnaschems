import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PATCH(req: Request, { params }: { params: { categoryid: string } }) {
    const { categoryid } = params;
    const { year_status } = await req.json();

    try {

        await prisma.yojanaYear.update({
            where: { yojana_year_id: Number(categoryid) },
            data: { year_status },
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