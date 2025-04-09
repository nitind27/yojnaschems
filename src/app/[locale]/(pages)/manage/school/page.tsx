// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Schooltitle from "@/app/[locale]/title/schooltitle";

import Clusteradd from "@/components/manage/Clusteradd";
import School from "@/components/manage/School";
import { clusterdata, Schooldata, talukasdata } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
  let schooldata: Schooldata[] = [];
  let clusterdata: clusterdata[] = [];
  let talukas: talukasdata[] = []; // To store the fetched talukasData
  try {
    schooldata = await prisma.school.findMany(); // Fetch all school
    clusterdata = await prisma.clusterData.findMany(); // Fetch all clusters
    talukas = await prisma.talukasData.findMany(); // Fetch talukas data here

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
    { label: 'school', href: '/manage/school' },
  ];
  return (
    <div>

      <h1 className="card card-body mt-5"><TitleCard breadcrumbs={breadcrumbs} /></h1>
      <School initialschoolData={schooldata} clusterdata={clusterdata} talukas={talukas} />
    </div>
  );
};

export default Page;