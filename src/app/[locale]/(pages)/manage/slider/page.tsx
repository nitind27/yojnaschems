// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";

 import Loader from "@/common/Loader ";

import Clusteradd from "@/components/manage/Clusteradd";
import Slider from "@/components/manage/Slider";
import { clusterdata, TblSlider } from "@/components/type";
import prisma from "@/lib/db";

import React from "react";

const Page = async () => {
  let Slidertbl: TblSlider[] = [];

  try {
    Slidertbl = await prisma.tbl_slider.findMany(); // Fetch all clusters
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  if (!Slidertbl) {
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

      <Slider Slidertbl={Slidertbl} />
    </div>
  );
};

export default Page;
