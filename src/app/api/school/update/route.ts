import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        const body = await req.json();
        const {
            school_id,   // Receive school_id to identify the record
            school_name,
            school_name_mr,
            address,
            cluster_id,
            taluka_id,
            udias,
            stds,
            medium,
            email_id,
            mukhya_name,
            mukhya_contact,
            mukhya_email,
            purush_name,
            purush_contact,
            purush_email,
            stri_name,
            stri_contact,
            stri_email,
            image_urls
        } = body;

        // Validate input
        // if (!school_id || !school_name || !school_name_mr || !address || !cluster_id || !taluka_id || !udias || !email_id) {
        //     return NextResponse.json({ error: 'All required fields must be filled' }, { status: 400 });
        // }

        // Convert taluka_id, cluster_id, and other numeric fields to integers
        const talukaIdInt = parseInt(taluka_id, 10);
        const clusterIdInt = parseInt(cluster_id, 10);
        const udiasStr = String(udias);  // Ensure UDIAS is a string

        // Check if conversion was successful
        if (isNaN(talukaIdInt) || isNaN(clusterIdInt)) {
            return NextResponse.json({ error: 'Taluka ID and Cluster ID must be valid numbers' }, { status: 400 });
        }

        // Check if the school with the provided ID exists
        const schoolExists = await prisma.school.findUnique({
            where: { school_id: parseInt(school_id, 10) }
        });

        if (!schoolExists) {
            return NextResponse.json({ error: 'School not found' }, { status: 404 });
        }

        // Update the School entry
        const updatedSchool = await prisma.school.update({
            where: { school_id: parseInt(school_id, 10) },
            data: {
                school_name,
                school_name_mr,
                address,
                cluster_id: clusterIdInt,  // Use converted integer
                taluka_id: talukaIdInt,    // Use converted integer
                udias: udiasStr,
                stds,
                medium,
                email_id,
                mukhya_name,
                mukhya_contact,
                mukhya_email,
                purush_name,
                purush_contact,
                purush_email,
                stri_name,
                stri_contact,
                stri_email,
                image_urls,
                status: 'Active',  // Default status (if applicable)
            },
        });

        // Convert BigInt fields to string before sending the response (if applicable)
        const responseData = {
            ...updatedSchool,
            school_id: updatedSchool.school_id.toString(), // Assuming school_id is a BigInt
        };

        return NextResponse.json(responseData, { status: 200 });
    } catch (error) {
        console.error("Error during school update:", error);
        // Return specific error message if available
        return NextResponse.json({ error: error || 'Internal Server Error' }, { status: 500 });
    }
}
