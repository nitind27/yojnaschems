import prisma from "@/lib/db";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    // Get the cluster_name from the request body
    const body = await req.json();
    const {
      category_id,
      sub_category_id,
      yojana_type,
      yojana_year_id,
      amount,
      yojana_name,
    } = body;

    // Check if cluster_name is provided
    if (
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
    const newCategory = await prisma.documentYojana.create({
      data: {
        category_id: categoryid,
        subcategory_id : subcategoryid,
        yojana_id : yojana_type,
        status: "Active", // Add default status if needed
  
      },
    });

    return NextResponse.json(newCategory, { status: 201 });
  } catch (error: any) {
    console.error("Error during insertion:", error); // Log the error for debugging

    // Return a 500 error if something goes wrong
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
