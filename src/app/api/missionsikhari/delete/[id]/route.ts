import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
    const { id } = params;

    try {
        await prisma.missionshikari.delete({
            where: { id: Number(id) },
        });

        return new NextResponse(null, { status: 204 });
    } catch (error: any) {
        console.error("Error during deletion:", error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'MissionShikari not found' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
