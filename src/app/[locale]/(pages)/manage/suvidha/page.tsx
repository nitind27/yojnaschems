// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Suvidhatitle from "@/app/[locale]/title/suvidhatitle";


import Suvidha from "@/components/manage/Suvidha";
import { Facility } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
  let Facilitydata: Facility[] = [];

  try {
    Facilitydata = await prisma.facility.findMany(); // Fetch all clusters
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
    { label: 'suvidha', href: '/manage/suvidha' },
  ];
  return (
    <div>

      <h1 className="card card-body mt-5"><TitleCard breadcrumbs={breadcrumbs} /></h1>
      <Suvidha initialfacilitydata={Facilitydata} />
    </div>
  );
};

export default Page;