import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        const body = await req.json();
        const { taluka_id, gp_id, name, name_marathi, total_population, trible_population, arthik_maryada, village_type } = body;

        // // Validate input
        // if (!taluka_id || !gp_id || !name || !name_marathi || !total_population || !trible_population || !arthik_maryada || !village_type) {
        //     return NextResponse.json({ error: 'All fields are required' }, { status: 400 });
        // }

        // Convert fields to appropriate types
        const talukaIdInt = parseInt(taluka_id, 10);
        const gpIdInt = parseInt(gp_id, 10);
        const totalPopulationInt = parseInt(total_population, 10);
        const triblePopulationInt = parseInt(trible_population, 10);
        const arthikMaryadaDecimal = parseFloat(arthik_maryada);

        // Check if conversions were successful
        if (isNaN(talukaIdInt) || isNaN(gpIdInt) || isNaN(totalPopulationInt) || isNaN(triblePopulationInt) || isNaN(arthikMaryadaDecimal)) {
            return NextResponse.json({ error: 'Invalid input types' }, { status: 400 });
        }

        // Create new Village entry
        const newVillage = await prisma.villages.create({
            data: {
                taluka_id: talukaIdInt,
                gp_id: gpIdInt,
                name,
                name_marathi,
                total_population: totalPopulationInt,
                trible_population: triblePopulationInt,
                arthik_maryada: arthikMaryadaDecimal,
                village_type,
                status: 'Active', // Default status
            },
        });

        // Prepare response data
        const responseData = {
            ...newVillage,
            id: newVillage.id.toString(), // Assuming id is a BigInt
        };

        return NextResponse.json(responseData, { status: 201 });
    } catch (error) {
        console.error("Error during insertion:", error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}