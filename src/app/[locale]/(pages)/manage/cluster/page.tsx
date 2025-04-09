// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";

import Cluster from "@/app/[locale]/title/cluster"; import Loader from "@/common/Loader ";
;
import Clusteradd from "@/components/manage/Clusteradd";
import { clusterdata } from "@/components/type";
import prisma from "@/lib/db";
import { useTranslations } from "next-intl";
import React from "react";

const Page = async () => {
  let clusterdata: clusterdata[] = [];

  try {
    clusterdata = await prisma.clusterData.findMany(); // Fetch all clusters
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  if (!clusterdata) {
    return (
      <>
        <Loader />
      </>
    )
  }
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'clustermenu', href: '/manage/cluster' },
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

      <Clusteradd initialClusterData={clusterdata} />
    </div>
  );
};

export default Page;
