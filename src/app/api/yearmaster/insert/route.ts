import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { yojana_year } = body;

        // Check if the yojana_year already exists
        const existing = await prisma.yojanaYear.findFirst({
            where: { yojana_year: yojana_year },
        });

        if (existing) {
            return NextResponse.json(
                { message: 'Yojana year already exists.' },
                { status: 400 }
            );
        }

        // Create new entry
        const newCategory = await prisma.yojanaYear.create({
            data: {
                yojana_year: yojana_year,
                year_status: 'Y',
            },
        });

        return NextResponse.json(newCategory, { status: 201 });
    } catch (error: any) {
        console.error("Error during insertion:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
