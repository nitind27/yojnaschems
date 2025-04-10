import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const { yojana_year, yojana_year_id, new_yojana_year, year_status } = body;

        // Check if the yojana_year exists
        const existing = await prisma.yojanaYear.findFirst({
            where: { yojana_year: yojana_year },
        });

  

        // Check if the new_yojana_year already exists
        const duplicate = await prisma.yojanaYear.findFirst({
            where: { yojana_year: new_yojana_year },
        });

  

        // Update the entry
        const updatedCategory = await prisma.yojanaYear.update({
            where: { yojana_year_id: yojana_year_id },
            data: {
                yojana_year: new_yojana_year || yojana_year,
                year_status: year_status,
            },
        });

        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error: any) {
        console.error("Error during update:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
