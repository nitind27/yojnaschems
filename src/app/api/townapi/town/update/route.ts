import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

interface UpdateTalukaRequest {
    id: string;
    name: string;
}

export async function PUT(req: Request) {
    try {
        const body: UpdateTalukaRequest = await req.json();
        const { id, name } = body;

        // Validate input
        if (!id || !name) {
            return NextResponse.json({ error: 'ID and name are required' }, { status: 400 });
        }

        // Update the Taluka in the database
        const updatedTaluka = await prisma.talukasData.update({
            where: { id: BigInt(id) },
            data: {
                name,
                status: "active",
            },
        });

        // Convert BigInt fields to strings for JSON response
        return NextResponse.json({
            message: 'Taluka updated successfully',
            taluka: {
                ...updatedTaluka,
                id: updatedTaluka.id.toString(), // Convert ID to string
            },
        }, { status: 200 });
    } catch (error: any) {
        console.error("Error during update:", error);

        // Handle specific Prisma error codes
        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'Taluka not found' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}