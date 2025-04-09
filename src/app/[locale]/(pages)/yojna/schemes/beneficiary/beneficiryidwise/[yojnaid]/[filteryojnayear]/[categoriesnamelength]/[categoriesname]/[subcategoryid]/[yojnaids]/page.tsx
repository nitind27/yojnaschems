// app/page.tsx
import Beneficiarytitile from "@/app/[locale]/title/Beneficiarytitile";
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Cluster from "@/app/[locale]/title/cluster"; import Loader from "@/common/Loader ";
;
import Clusteradd from "@/components/manage/Clusteradd";
import Beneficiary from "@/components/Schemes/Beneficiary";
import Beneficiarydata from "@/components/Schemes/Beneficiarydata";
import Category from "@/components/Schemes/Category";
import SubCategorys from "@/components/Schemes/SubCategorys";
import { Bank, Categorys, grampanchayat, SubCategory, talukasdata, Tblbankmaster, TblBeneficiary, TblCaste, TblEvaluation, TblMembers, tblparivahan, TblParivahanBeneficiary, TblUsers, TblYojanaType, Villages, YojanaYear } from "@/components/type";
import prisma from "@/lib/db";
import { YojanaMaster } from "@prisma/client";
import { title } from "process";
import React from "react";

const Page = async ({ params }: any) => {
    const { yojnaid } = params;
    const { filteryojnayear } = params;
    const { categoriesnamelength } = params;
    const { categoriesname } = params;
    const { subcategoryid } = params;
    const { yojnaids } = params;
    // const { yojnaid } = params;
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
    let Parivahantbl: tblparivahan[] = [];
    let tbluser: TblUsers[] = [];
    let parivahanbeneficiary: TblParivahanBeneficiary[] = [];
    let tblevaluation: TblEvaluation[] = [];

    try {
        category = await prisma.category.findMany(); // Fetch all clusters
        subCategory = await prisma.subCategory.findMany(); // Fetch all clusters
        YojnaYear = await prisma.yojanaYear.findMany(); // Fetch all clusters
        beneficiary = await prisma.beneficiary.findMany(); // Fetch all clusters
        Bankdata = await prisma.bank.findMany();
        yojnatype = await prisma.yojnatype.findMany();
        yojnamaster = await prisma.yojanaMaster.findMany();
        Parivahantbl = await prisma.tblparivahan.findMany();
        talukas = await prisma.talukasData.findMany();
        cast = await prisma.tblcaste.findMany();
        Villages = await prisma.villages.findMany(); // Fetch all QR codes
        grampanchayat = await prisma.grampanchayat.findMany();
        membersadd = await prisma.tbl_members.findMany();
        tblevaluation = await prisma.tbl_evaluation.findMany();
        Bankmasterdata = await prisma.tbl_bankmaster.findMany(); // Fetch all clusters
        tbluser = await prisma.tblusers.findMany(); // Fetch all clusters
        parivahanbeneficiary = await prisma.parivahanbeneficiary.findMany(); // Fetch all clusters
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

    const filteredYojnamaster = yojnamaster.filter(
        (d) =>
            d.yojana_year_id == yojnaids && // Match the yojana year ID
            d.category_id === 2 && // Ensure category_id is 2
            d.status !== "Deactive" && // Exclude inactive statuses
            d.sub_category_id == subcategoryid // Match the sub_category_id
    );

    // Get unique subcategories from the filtered YojanaMaster
    const uniqueSubCategories = Array.from(
        new Set(filteredYojnamaster.map((yojna) => yojna.sub_category_id))
    ).map((id) => {
        return subCategory.find((cat) => cat.sub_category_id == id); // Use 'id' to find the correct subcategory
    });

    const categoriesnames = uniqueSubCategories.map((data) => data?.sub_category_name);

    const breadcrumbs = [

        { label: 'dashboard', href: '/dashboard' },
        { label: 'nbschemes', href: '', linkurl: "/dashboard/nbschemes" },
        { label: '', title: `${filteryojnayear}`, href: '', linkurl: `/dashboard/nbschemes/nbschemescategory/${yojnaids}` },
        { label: '', title: `${categoriesnames}${categoriesnamelength}`, href: `/yojna/schemes/beneficiary/beneficiryidwise/${yojnaid}/${filteryojnayear}/${categoriesnamelength}/${categoriesnamelength}/${subcategoryid}/${yojnaids}` },

    ];
    const filterdatabeneficiary = beneficiary.filter((data) => data.yojana_id == yojnaids);
    const parivahanfilter = Parivahantbl.filter((data) => data.yojana_id == yojnaid)

    return (
        <div>

            <h1 className="card card-body mt-5">

                <TitleCard breadcrumbs={breadcrumbs} />
            </h1>
            <Beneficiarydata initialcategoryData={subCategory} YojnaYear={YojnaYear} Bankdata={Bankdata} category={category} beneficiary={beneficiary} yojnatype={yojnatype} yojnamaster={yojnamaster} talukas={talukas} grampanchayat={grampanchayat} Villages={Villages} castdata={cast} membersadd={membersadd} Bankmasterdata={Bankmasterdata} Parivahantbl={parivahanfilter} tbluserdata={tbluser} parivahanbeneficiary={parivahanbeneficiary} yojnaid={yojnaid} tblevaluation={tblevaluation}/>
        </div>
    );
};

export default Page;
