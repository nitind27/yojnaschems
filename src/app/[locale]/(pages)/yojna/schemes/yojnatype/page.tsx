
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Cluster from "@/app/[locale]/title/cluster"; import Yojnatypetitle from "@/app/[locale]/title/Yojnatypetitle";
import Loader from "@/common/Loader ";

import Yojnatype from "@/components/Schemes/Yojnatype";
import { Bank, Categorys, SubCategory, TblYojanaType, YojanaYear } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
    let subCategory: SubCategory[] = [];
    let yojnatype: TblYojanaType[] = [];
    let Bankdata: Bank[] = [];
    let category: Categorys[] = [];


    try {
        category = await prisma.category.findMany(); // Fetch all clusters
        subCategory = await prisma.subCategory.findMany(); // Fetch all clusters
        yojnatype = await prisma.yojnatype.findMany(); // Fetch all clusters
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
        { label: 'Yojnatype', href: '/yojna/schemes/yojnatype' },
    ];
    return (
        <div>

            <h1 className="card card-body mt-5">
                <TitleCard breadcrumbs={breadcrumbs} />
            </h1>

            <Yojnatype initialcategoryData={subCategory} yojnatype={yojnatype} Bankdata={Bankdata} category={category} />
        </div>
    );
};

export default Page;
