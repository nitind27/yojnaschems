
import SubCategorytitle from "@/app/[locale]/title/Subcategory";
import Loader from "@/common/Loader ";

import { Bank, Categorys, Representative, SubCategory, WorkMaster, WorkMasterDemo, YojanaYear } from "@/components/type";
import Workmaster from "@/components/Workmaster/Workmaster";

import prisma from "@/lib/db";
import React from "react";
import TitleCard from "../../title/breadcums/Titilecard";
import Generateform from "@/components/Workmaster/Generateform";

const Page = async () => {
    let subCategory: SubCategory[] = [];
    let YojnaYear: YojanaYear[] = [];
    let Bankdata: Bank[] = [];
    let category: Categorys[] = [];
    let Workmasters: WorkMasterDemo[] = [];
    let reprenstive: Representative[] = [];


    try {
        category = await prisma.category.findMany(); // Fetch all clusters
        subCategory = await prisma.subCategory.findMany(); // Fetch all clusters
        YojnaYear = await prisma.yojanaYear.findMany(); // Fetch all clusters
        Bankdata = await prisma.bank.findMany();
        Workmasters = await prisma.workMasterDemo.findMany();
        reprenstive = await prisma.representative.findMany();

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
        { label: 'workmaster', href: '/workmaster' },
    ];
        const workgen = Workmasters.filter((gen) => gen.type == "workgen" && gen.status =="Active")
    return (
        <div>

            <h1 className="card card-body mt-5">
                <TitleCard breadcrumbs={breadcrumbs} />
            </h1>
            <Generateform initialcategoryData={subCategory} YojnaYear={YojnaYear} Bankdata={Bankdata} category={category} Workmasters={workgen} reprenstive={reprenstive} />
            {/* <Workmaster initialcategoryData={subCategory} YojnaYear={YojnaYear} Bankdata={Bankdata} category={category} Workmasters={Workmasters} reprenstive={reprenstive} /> */}
        </div>
    );
};

export default Page;
