import Nidhiaada from "@/app/[locale]/title/Nidhiaada";
import Parivahantitle from "@/app/[locale]/title/Parivahantitle";
import SubCategorytitle from "@/app/[locale]/title/Subcategory";
import Loader from "@/common/Loader ";
import Parivahan from "@/components/Schemes/Parivahan";
import Parivahanamountadd from "@/components/Schemes/Parivahanamountadd";
import {
  Bank,
  Categorys,
  Padnam,
  SubCategory,
  TblBeneficiary,
  TblEvaluation,
  TblEvaluationAmount,
  tblparivahan,
  TblParivahanBeneficiary,
  TblUsers,
  TblYojanaType,
  YojanaMaster,
  YojanaYear,
} from "@/components/type";
import prisma from "@/lib/db";

import React from "react";

const Page = async () => {
  let subCategory: SubCategory[] = [];
  let YojnaYear: YojanaYear[] = [];
  let Bankdata: Bank[] = [];
  let yojnatype: TblYojanaType[] = [];
  let yojanaMaster: YojanaMaster[] = [];
  let category: Categorys[] = [];
  let Parivahanbeneficiarys: TblParivahanBeneficiary[] = [];
  let Parivahantbl: tblparivahan[] = [];
  let Beneficiary: TblBeneficiary[] = [];
  let Userdata: TblUsers[] = [];
  let TblEvaluation: TblEvaluation[] = [];
  let TblEvaluationAmount: TblEvaluationAmount[] = [];
  let Padnam: Padnam[] = [];

  try {
    category = await prisma.category.findMany(); // Fetch all clusters
    subCategory = await prisma.subCategory.findMany(); // Fetch all clusters
    yojnatype = await prisma.yojnatype.findMany(); // Fetch all clusters
    YojnaYear = await prisma.yojanaYear.findMany(); // Fetch all clusters
    yojanaMaster = await prisma.yojanaMaster.findMany(); // Fetch all clusters
    Bankdata = await prisma.bank.findMany();
    TblEvaluation = await prisma.tbl_evaluation.findMany();
    TblEvaluationAmount = await prisma.tbl_evaluation_amount.findMany();
    Beneficiary = await prisma.beneficiary.findMany();
    Parivahanbeneficiarys = await prisma.parivahanbeneficiary.findMany();
    Parivahantbl = await prisma.tblparivahan.findMany();
    Userdata = await prisma.tblusers.findMany();
    Padnam = await prisma.padnam.findMany();
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
    );
  }

  const usersdata = Userdata.filter((user) => user.category_id === 35);
  const yojnamaster = yojanaMaster.filter((yojna) => yojna.status =="Active" );
  // const TblEvaluationfilter = TblEvaluation.filter((yojna) => yojna.evaluation_status =="Pending" );
  return (
    <div>
      <h1 className="card card-body mt-5">
        <Nidhiaada />
      </h1>

      <Parivahanamountadd
        category={category}
        subCategory={subCategory}
        YojnaYear={YojnaYear}
        Bankdata={Bankdata}
        yojnatype={yojnatype}
        yojanaMaster={yojnamaster}
        Parivahanbeneficiarys={Parivahanbeneficiarys}
        Parivahantbl={Parivahantbl}
        Beneficiary={Beneficiary}
        Userdata={usersdata}
        TblEvaluation={TblEvaluation}
        TblEvaluationAmount={TblEvaluationAmount}
      />
    </div>
  );
};

export default Page;
