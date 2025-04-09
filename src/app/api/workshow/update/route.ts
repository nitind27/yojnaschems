import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        // Get the data from the request body
        const body = await req.json();
        const { id, representative_id, representative_name, number_work, genratedworkdate, estimatedtotalamount, generatednumber,

            taluka_id,
            gp_id,
            village_id,
            facility_id,
            name,
            estimated_amount,
            tantrik_manyata_amount,
            prashashakiya_manyata,
            prashashakiya_manyata_no,
            prashashakiya_manyata_date,
            prashashakiya_manyata_amount } = body;

        // Check if id is provided
        if (!id) {
            return NextResponse.json({ error: 'ID is required' }, { status: 400 });
        }

        // Parse and validate incoming data
        const representativeId = parseInt(representative_id);
        const numberwork = parseInt(number_work);
        const talukaid = parseInt(taluka_id);
        const gpid = parseInt(gp_id);
        const villageid = parseInt(village_id);
        const facilityid = parseInt(facility_id);
        const generatednumbers = String(generatednumber);
        const estimatedamount = parseFloat(estimated_amount);
        const tantrikmanyataamount = parseFloat(tantrik_manyata_amount);
        const prashashakiyamanyataamount = parseFloat(prashashakiya_manyata_amount);
        const parsedDate = new Date(prashashakiya_manyata_date);
        const formattedDate = parsedDate.toISOString();
        // Update the existing record in the database
        const updatedCategory = await prisma.workMasterDemo.update({
            where: { id: id }, // Assuming 'id' is the unique identifier
            data: {
                representative_id: representativeId,
                representative_name: representative_name,
                number_work: numberwork,
                genratedworkdate: genratedworkdate,
                estimatedtotalamount: estimatedtotalamount,
                generatednumber: generatednumbers,
                type: "work",
                taluka_id: talukaid,
                gp_id: gpid,
                village_id: villageid,
                facility_id: facilityid,
                name: name,
                estimated_amount: estimatedamount,
                tantrik_manyata_amount: tantrikmanyataamount,
                prashashakiya_manyata: prashashakiya_manyata,
                prashashakiya_manyata_no,
                prashashakiya_manyata_date:formattedDate,
                prashashakiya_manyata_amount:prashashakiyamanyataamount,
                status: "Active",
                latitude: "0.0", // Update if necessary
                longitude: "0.0" // Update if necessary
            },
        });

        // Return the updated category with a 200 OK status
        return NextResponse.json(updatedCategory, { status: 200 });
    } catch (error: any) {
        console.error("Error during update:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}