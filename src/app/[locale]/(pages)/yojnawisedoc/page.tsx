// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Cluster from "@/app/[locale]/title/cluster"; import Plantitle from "@/app/[locale]/title/Plantitle";
import Loader from "@/common/Loader ";
;
import Clusteradd from "@/components/manage/Clusteradd";
import Category from "@/components/Schemes/Category";
import Documentwisedata from "@/components/Schemes/Documentwisedata";
import Plans from "@/components/Schemes/Plans";
import SubCategorys from "@/components/Schemes/SubCategorys";
import { Bank, Categorys, Document, DocumentYojana, SubCategory, TblYojanaType, YojanaMaster, YojanaYear } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
    let subCategory: SubCategory[] = [];
    let YojnaYear: YojanaYear[] = [];
    let yojnatype: TblYojanaType[] = [];
    let Bankdata: Bank[] = [];
    let category: Categorys[] = [];
    let yojnamaster: YojanaMaster[] = [];
    let Documentdatas: Document[] = [];
    let yojnawiseDocumentdatas: DocumentYojana[] = [];
    try {
        category = await prisma.category.findMany(); // Fetch all clusters
        subCategory = await prisma.subCategory.findMany(); // Fetch all clusters
        YojnaYear = await prisma.yojanaYear.findMany(); // Fetch all clusters
        yojnatype = await prisma.yojnatype.findMany(); // Fetch all clusters
        yojnamaster = await prisma.yojanaMaster.findMany(); // Fetch all clusters
        Bankdata = await prisma.bank.findMany();
        Documentdatas = await prisma.document.findMany();
        yojnawiseDocumentdatas = await prisma.documentYojana.findMany();
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
        { label: 'Plan', href: '/yojna/schemes/plans' },
    ];
    return (
        <div>

            <h1 className="card card-body mt-5">
                <TitleCard breadcrumbs={breadcrumbs} />
            </h1>
            <Documentwisedata initialcategoryData={subCategory} YojnaYear={YojnaYear} Bankdata={Bankdata} category={category} yojnatype={yojnatype} yojnamaster={yojnamaster} Documentdatas={Documentdatas} yojnawiseDocumentdatas={yojnawiseDocumentdatas}/>
        </div>
    );
};

export default Page;
