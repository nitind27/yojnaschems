
// import { Bank as BankType } from "@/components/type";

import Banktitle from "@/app/[locale]/title/Bank";
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import BankData from "@/components/manage/Bank";
import { Bank, YojanaYear } from "@/components/type";

import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
  let Bankdata: Bank[] = [];
  let YojnaYear: YojanaYear[] = [];

  try {
    Bankdata = await prisma.bank.findMany(); // Fetch all clusters
    YojnaYear = await prisma.yojanaYear.findMany(); // Fetch all clusters
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'Bank', href: '/manage/bank' },
  ];
  return (
    <div>

      <h1 className="card card-body mt-5"> <TitleCard breadcrumbs={breadcrumbs} /></h1>
      <BankData
        initialBankData={Bankdata}
        YojnaYear={YojnaYear}
        Villages={[]}
        talukas={[]}
        grampanchayat={[]}
      />
    </div>
  );
};

export default Page;
