import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { parivahan_date, outward_no, sup_id, yojana_year_id, yojana_type, yojana_id, parivahan_no, beneficiary_id, installment } = body;

        const formattedDate = new Date(parivahan_date);
        if (isNaN(formattedDate.getTime())) {
            throw new Error('Invalid date format. Please provide a valid ISO-8601 date.');
        }

        const supIdNumber = Number(sup_id);
        const yojana_yearid = Number(yojana_year_id);
        const yojanaid = Number(yojana_id);
        const parivahanno = Number(parivahan_no);

        // Split beneficiary_id and installment arrays
        const beneficiaryIds = beneficiary_id.split(',').map((id: string) => id.trim());
        const installmentValues = Array.isArray(installment) ? installment : [installment];

        // Ensure installmentValues and beneficiaryIds length match
        if (beneficiaryIds.length !== installmentValues.length) {
            throw new Error('Mismatch in beneficiary and installment count.');
        }

        // Insert each beneficiary_id with respective installment value
        const insertPromises = beneficiaryIds.map(async (beneficiary: any, index: any) => {
            return prisma.parivahanbeneficiary.create({
                data: {
                    parivahan_no: parivahanno,
                    parivahan_date: formattedDate.toISOString(),
                    outward_no,
                    sup_id: supIdNumber,
                    yojana_year_id: yojana_yearid,
                    yojana_type,
                    yojana_id: yojanaid,
                    installment: installmentValues[index], // Assigning installment value correctly
                    beneficiary_id: beneficiary,
                    status: "Active",
                    ins_date: new Date().toISOString()
                },
            });
        });

        const newCategories = await Promise.all(insertPromises);

        return NextResponse.json(
            newCategories.map((category) => ({
                ...category,
                parivahan_no: category.parivahan_no.toString(),
            })),
            { status: 201 }
        );

    } catch (error: any) {
        console.error("Error during insertion:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
