import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { name, name_marathi, taluka_id, population } = body;

        // Validate input
        if (!name || !name_marathi || !taluka_id || !population) {
            return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        }

        // Convert taluka_id and population to integers
        const talukaIdInt = parseInt(taluka_id, 10);
        const populationInt = parseInt(population, 10);

        // Check if conversion was successful
        if (isNaN(talukaIdInt) || isNaN(populationInt)) {
            return NextResponse.json({ error: 'Taluka ID and Population must be valid numbers' }, { status: 400 });
        }

        // Create new Grampanchayat entry
        const newGrampanchayat = await prisma.grampanchayat.create({
            data: {
                name,
                name_marathi,
                taluka_id: talukaIdInt,  // Use the converted integer
                population: populationInt, // Use the converted integer
                status: 'Active', // Default status
            },
        });

        // Convert BigInt fields to string before sending the response
        const responseData = {
            ...newGrampanchayat,
            id: newGrampanchayat.id.toString(), // Assuming id is a BigInt
        };

        return NextResponse.json(responseData, { status: 201 });
    } catch (error) {
        console.error("Error during insertion:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}