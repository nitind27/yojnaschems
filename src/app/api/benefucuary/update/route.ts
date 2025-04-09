import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
    try {
        // Get the beneficiary ID from the request URL or body

        const body = await req.json();

        // Extract fields from the request body
        const {
            beneficiary_id,
            category_id,
            sub_category_id,
            yojana_year_id,
            yojana_type,
            yojana_id,
            taluka_id,
            gp_id,
            village_id,
            surname,
            firstname,
            middlename,
            fullname,
            gat_name,
            gat_certificate,
            member,
            caste_id,
            beneficiary_type,
            rashion_no,
            aadhar,
            mobile,
            bank_name,
            ifsc,
            ac_no,
            tot_finance,
            amount_paid,
            fourty,
            sixty,
            hundred,
            organization,
            work_order_date
        } = body;

        // Parse IDs to integers
        const categoryid = parseInt(category_id, 10);
        const subcategoryid = parseInt(sub_category_id, 10);
        const yojnaid = parseInt(yojana_id, 10);
        const memberid = parseInt(member, 10);
        const talukaid = parseInt(taluka_id, 10);
        const gpid = parseInt(gp_id, 10);
        const casteid = parseInt(caste_id, 10);
        const villageid = parseInt(village_id, 10);
        const yojanayearid = parseInt(yojana_year_id, 10);

        // Update the beneficiary in the database
        const updatedBeneficiary = await prisma.beneficiary.update({
            where: { beneficiary_id: Number(beneficiary_id) }, // Use the ID to find the record
            data: {
                category_id: categoryid ? categoryid : undefined, // Use undefined to skip updating if not provided
                sub_category_id: subcategoryid ? subcategoryid : undefined,
                yojana_year_id: yojanayearid ? yojanayearid : undefined,
                yojana_type: yojana_type ? yojana_type : undefined,
                yojana_id: yojnaid ? yojnaid : undefined,
                taluka_id: talukaid ? talukaid : undefined,
                gp_id: gpid ? gpid : undefined,
                village_id: villageid ? villageid : undefined,
                surname: surname ? surname : undefined,
                firstname: firstname ? firstname : undefined,
                middlename: middlename ? middlename : undefined,
                fullname: fullname ? fullname : undefined,
                gat_name: gat_name ? gat_name : undefined,
                gat_certificate: gat_certificate ? gat_certificate : undefined,
                member: memberid ? memberid : undefined,
                caste_id: casteid ? casteid : undefined,
                beneficiary_type: beneficiary_type ? beneficiary_type : undefined,
                rashion_no: rashion_no ? rashion_no : undefined,
                aadhar: aadhar ? aadhar : undefined,
                mobile: mobile ? mobile : undefined,
                bank_name: bank_name ? bank_name : undefined,
                ifsc: ifsc ? ifsc : undefined,
                ac_no: ac_no ? ac_no : undefined,
                tot_finance: tot_finance ? tot_finance : undefined,
                amount_paid: amount_paid ? amount_paid : undefined,
                fourty: fourty ? fourty : undefined,
                sixty: sixty ? sixty : undefined,
                hundred: hundred ? hundred : undefined,
                organization: organization ? organization : undefined,
                work_order_date: work_order_date ? work_order_date : undefined
            },
        });

        // Return the updated beneficiary with a 200 OK status
        return NextResponse.json(updatedBeneficiary, { status: 200 });
    } catch (error) {
        console.error("Error during update:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}