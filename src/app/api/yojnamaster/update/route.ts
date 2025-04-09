// pages/api/clusters/updateCluster.ts
import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function PUT(req: Request) {
  try {
    // Get the data from the request body
    const body = await req.json();
    const {
      yojana_id,

      category_id,
      sub_category_id,
      yojana_type,
      yojana_year_id,
      amount,
      yojana_name,
    } = body;

    if (
      !yojana_id ||
      !category_id ||
      !sub_category_id ||
      !yojana_year_id ||
      !yojana_type ||
      !yojana_name ||
      !amount
    ) {
      return NextResponse.json(
        { error: "All filed required" },
        { status: 400 }
      );
    }
    const categoryid = parseInt(category_id, 10);
    const subcategoryid = parseInt(sub_category_id, 10);

    const yojanayearid = parseInt(yojana_year_id, 10);
    // Insert the new category into the database
    // Update the cluster in the database
    const updatedCluster = await prisma.yojanaMaster.update({
      where: { yojana_id }, // Use the provided cluster_id to find the correct record
      data: {
        category_id: categoryid,
        sub_category_id: subcategoryid,
        yojana_type,
        yojana_year_id: yojanayearid,
        yojana_name,
        amount: amount,
        gat: "",
        status: "Active", // Add default status if needed
        date_ins: new Date(), // Example value for date_ins
        uddesh_swarup: "", // Provide actual value
        patrata: "", // Provide actual value
        sampark: "", // Provide actual value
      },
    });

    // Return the updated cluster with a 200 OK status
    return NextResponse.json(updatedCluster, { status: 200 });
  } catch (error: any) {
    console.error("Error during update:", error); // Log the error for debugging

    // Return a 500 error if something goes wrong
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
