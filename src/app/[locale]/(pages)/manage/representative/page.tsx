// app/page.tsx

import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Representativetitle from "@/app/[locale]/title/representativetitle";
import Representative from "@/components/manage/Representative";
import { Representative as RepresentativeType } from "@/components/type"; // Type import
import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
  let representatives: RepresentativeType[] = []; // Renamed variable to avoid conflict

  try {
    representatives = await prisma.representative.findMany(); // Fetch all representatives
  } catch (error) {
    console.error("Error fetching representative data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
        <p>There was an issue retrieving the representative data. Please try again later.</p>
      </div>
    );
  }

  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'pratinidhi', href: '/manage/representative' },
  ];
  return (
    <div>
 
      <h1 className="card card-body mt-5"> <TitleCard breadcrumbs={breadcrumbs} /></h1>
      <Representative initialRepresentative={representatives} />
    </div>
  );
};

export default Page;