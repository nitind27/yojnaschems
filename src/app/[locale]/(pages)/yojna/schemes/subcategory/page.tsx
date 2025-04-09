
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import SubCategorytitle from "@/app/[locale]/title/Subcategory";
import Loader from "@/common/Loader ";


import SubCategorys from "@/components/Schemes/SubCategorys";
import { Bank, Categorys, SubCategory, YojanaYear } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
    let subCategory: SubCategory[] = [];
    let YojnaYear: YojanaYear[] = [];
    let Bankdata: Bank[] = [];
    let category: Categorys[] = [];


    try {
        category = await prisma.category.findMany(); // Fetch all clusters
        subCategory = await prisma.subCategory.findMany(); // Fetch all clusters
        YojnaYear = await prisma.yojanaYear.findMany(); // Fetch all clusters
        Bankdata = await prisma.bank.findMany();

    } catch (error) {
        console.error("Error fetching cluster data:", error);
        return (
            <div>
                <h1>Error fetching Data</h1>
            </div>
        );
    }
    if (!subCategory) {
        return (
            <>
                <Loader />
            </>
        )
    }
    const breadcrumbs = [

        { label: 'dashboard', href: '/dashboard' },
        { label: 'subcategory', href: '/yojna/schemes/subcategory' },
    ];
    return (
        <div>

            <h1 className="card card-body mt-5">
                <TitleCard breadcrumbs={breadcrumbs} />
            </h1>

            <SubCategorys initialcategoryData={subCategory} YojnaYear={YojnaYear} Bankdata={Bankdata} category={category} />
        </div>
    );
};

export default Page;
