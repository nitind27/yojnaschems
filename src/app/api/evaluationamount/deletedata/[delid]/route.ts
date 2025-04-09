import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { delid: string } }) {
    const { delid } = params;

    try {
        await prisma.tbl_evaluation_amount.delete({
            where: { id: Number(delid) },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error("Error during deletion:", error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Disbursementfundes not found' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
