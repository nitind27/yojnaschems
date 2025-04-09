import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
    try {
        // Get the request body as JSON
        const body = await req.json();
        console.log('Request Body:', body); // Log the incoming request body

        // Destructure and parse values from the request body
        const {
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
            work_order_date,
        } = body;

        // Parse IDs into integers
        const categoryid = parseInt(category_id, 10) || 0;
        const subcategoryid = parseInt(sub_category_id, 10) || 0;
        const yojnaid = parseInt(yojana_id, 10) || 0;
        const memberid = parseInt(member, 10) || 0;
        const talukaid = parseInt(taluka_id, 10) || 0;
        const gpid = parseInt(gp_id, 10) || 0;
        const casteid = parseInt(caste_id, 10) || 0;
        const villageid = parseInt(village_id, 10) || 0;
        const yojanayearid = parseInt(yojana_year_id, 10) || 0;

        // Insert the new beneficiary into the database
        const newBeneficiary = await prisma.beneficiary.create({
            data: {
                category_id: categoryid,
                sub_category_id: subcategoryid,
                yojana_year_id: yojanayearid,
                yojana_type: yojana_type || "",
                yojana_id: yojnaid,
                taluka_id: talukaid,
                gp_id: gpid,
                village_id: villageid,
                surname: surname || "",
                firstname: firstname || "",
                middlename: middlename || "",
                fullname: fullname || "",
                gat_name: gat_name || "",
                gat_certificate: gat_certificate || "",
                member: memberid,
                caste_id: casteid,
                beneficiary_type: beneficiary_type || "",
                rashion_no: rashion_no || "",
                aadhar: aadhar || "",
                mobile: mobile || "",
                bank_name: bank_name || "",
                ifsc: ifsc || "",
                ac_no: ac_no || "",
                tot_finance: tot_finance || "",
                amount_paid: amount_paid || "",
                fourty: fourty === true ? '1' : (fourty ? String(fourty) : ""),
                sixty: sixty === true ? '1' : (sixty ? String(sixty) : ""),
                hundred: hundred === true ? '1' : (hundred ? String(hundred) : ""),
                organization: organization || "",
                work_order_date: work_order_date || "",
                date_ins: new Date(),
            },
        });

        console.log('New Beneficiary Created:', newBeneficiary); // Log the newly created beneficiary

        // Return the newly created beneficiary with a 201 Created status
        return NextResponse.json(newBeneficiary, { status: 201 });
    } catch (error) {
        console.error("Error during insertion:", error); // Log the error for debugging

        // Return a 500 error if something goes wrong
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}