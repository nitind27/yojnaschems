import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        
        const body = await req.json();
        const { id, bank_name, ifsc_code, talukaid } = body;

        const taluka_id = Number(talukaid);

        
        const updatedBank = await prisma.tbl_bankmaster.update({
            where: { id: id }, 
            data: {
                bank_name,
                ifsc_code,
                talukaid: taluka_id,
                status: "Active", 
            },
        });

        return NextResponse.json(updatedBank, { status: 200 });
    } catch (error: any) {
        console.error("Error during update:", error);

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
