// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";

import Cluster from "@/app/[locale]/title/cluster"; import Loader from "@/common/Loader ";
;
import Clusteradd from "@/components/manage/Clusteradd";
import BankMaster from "@/components/Schemes/BankMaster";
import { talukasdata, Tblbankmaster } from "@/components/type";
import prisma from "@/lib/db";
import { useTranslations } from "next-intl";
import React from "react";

const Page = async () => {
  let Bankdata: Tblbankmaster[] = [];
    let talukas: talukasdata[] = [];

  try {
    Bankdata = await prisma.tbl_bankmaster.findMany(); // Fetch all clusters
    talukas = await prisma.talukasData.findMany();
    
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  if (!Bankdata) {
    return (
      <>
        <Loader />
      </>
    )
  }
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'Bank', href: '/yojna/schemes/bankmaster' },
  ];
  return (
    <div>

      <div className="card p-3 mt-5">


        <div className="d-flex justify-between">

          <div>
            <TitleCard breadcrumbs={breadcrumbs} />
          </div>
        </div>
      </div>

      <BankMaster Bankdata={Bankdata} talukas={talukas}/>
    </div>
  );
};

export default Page;
