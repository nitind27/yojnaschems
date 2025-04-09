import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function DELETE(req: Request, { params }: { params: { benfid: string } }) {
    const { benfid } = params;

    // Split the incoming IDs by comma and convert them to numbers
    const beneficiaryIds = benfid.split(',').map(id => Number(id.trim()));

    try {
        // Delete beneficiaries using the unique identifiers
        const deletedBeneficiaries = await prisma.parivahanbeneficiary.deleteMany({
            where: {
                parivahan_id: {
                    in: beneficiaryIds, // Use the 'in' operator to match multiple IDs
                },
            },
        });

        // Return the number of deleted beneficiaries
        return NextResponse.json({ count: deletedBeneficiaries.count }, { status: 200 });
    } catch (error: any) {
        console.error("Error during beneficiary deletion:", error);

        if (error.code === 'P2025') {
            return NextResponse.json({ error: 'One or more beneficiaries not found' }, { status: 404 });
        }

        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
