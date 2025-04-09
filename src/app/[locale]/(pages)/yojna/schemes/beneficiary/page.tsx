// app/page.tsx
import Beneficiarytitile from "@/app/[locale]/title/Beneficiarytitile";
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Cluster from "@/app/[locale]/title/cluster"; import Loader from "@/common/Loader ";
;
import Clusteradd from "@/components/manage/Clusteradd";
import Beneficiary from "@/components/Schemes/Beneficiary";
import Category from "@/components/Schemes/Category";
import SubCategorys from "@/components/Schemes/SubCategorys";
import { Bank, Categorys, grampanchayat, SubCategory, talukasdata, Tblbankmaster, TblBeneficiary, TblCaste, TblMembers, TblYojanaType, Villages, YojanaYear } from "@/components/type";
import prisma from "@/lib/db";
import { YojanaMaster } from "@prisma/client";
import React from "react";

const Page = async () => {
    let subCategory: SubCategory[] = [];
    let YojnaYear: YojanaYear[] = [];
    let Bankdata: Bank[] = [];
    let category: Categorys[] = [];
    let beneficiary: TblBeneficiary[] = [];
    let yojnatype: TblYojanaType[] = [];
    let yojnamaster: YojanaMaster[] = [];
    let talukas: talukasdata[] = [];
    let grampanchayat: grampanchayat[] = [];
    let cast: TblCaste[] = [];
    let Villages: Villages[] = [];
    let membersadd: TblMembers[] = [];
      let Bankmasterdata: Tblbankmaster[] = [];
    try {
        category = await prisma.category.findMany(); // Fetch all clusters
        subCategory = await prisma.subCategory.findMany(); // Fetch all clusters
        YojnaYear = await prisma.yojanaYear.findMany(); // Fetch all clusters
        beneficiary = await prisma.beneficiary.findMany(); // Fetch all clusters
        Bankdata = await prisma.bank.findMany();
        yojnatype = await prisma.yojnatype.findMany();
        yojnamaster = await prisma.yojanaMaster.findMany();
        talukas = await prisma.talukasData.findMany();
        cast = await prisma.tblcaste.findMany();
        Villages = await prisma.villages.findMany(); // Fetch all QR codes
        grampanchayat = await prisma.grampanchayat.findMany();
        membersadd = await prisma.tbl_members.findMany();
        Bankmasterdata = await prisma.tbl_bankmaster.findMany(); // Fetch all clusters
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
        { label: 'Beneficiary', href: '/yojna/schemes/beneficiary' },
    ];
    const yojnayearfilter = YojnaYear.filter((data)=>data.year_status == "Y")
    return (
        <div>

            <h1 className="card card-body mt-5">
                <TitleCard breadcrumbs={breadcrumbs} />
            </h1>
            <Beneficiary initialcategoryData={subCategory} YojnaYear={yojnayearfilter} Bankdata={Bankdata} category={category} beneficiary={beneficiary} yojnatype={yojnatype} yojnamaster={yojnamaster} talukas={talukas} grampanchayat={grampanchayat} Villages={Villages} castdata={cast} membersadd={membersadd} Bankmasterdata={Bankmasterdata}/>
        </div>
    );
};

export default Page;
