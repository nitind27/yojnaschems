import prisma from '@/lib/db';
import { NextResponse } from 'next/server';

export async function PUT(req: Request) {
  try {
    // Get the updated data from request body
    const body = await req.json();
    const { document_id, category_id, subcategory_id, yojana_id, year_id, yojna_name, documents, ruleset, procedurebenefits, Eligibility, Approvedapplication, Implementationmechanism, applicationcost, applicationavailable, payafee, Expectedduration } = body;

    if (!document_id) {
      return NextResponse.json({ error: "Missing ID for update." }, { status: 400 });
    }

    const updatedCluster = await prisma.documentYojana.update({
      where: {
        document_id: Number(document_id),
      },
      data: {
        category_id: Number(category_id),
        subcategory_id: Number(subcategory_id),
        yojana_id: Number(yojana_id),
        year_id: year_id,
        yojna_name: yojna_name,
        documents: documents,
        ruleset: ruleset,
        procedurebenefits: procedurebenefits,
        Eligibility: Eligibility,
        Approvedapplication: Approvedapplication,
        Implementationmechanism: Implementationmechanism,
        applicationcost: applicationcost,
        applicationavailable: applicationavailable,
        payafee: payafee,
        Expectedduration: Expectedduration,
        status: "Active", // You can also pass this from frontend if needed
        update_date_time: new Date(),
      },
    });

    return NextResponse.json(updatedCluster, { status: 200 });
  } catch (error: any) {
    console.error("Error during update:", error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
