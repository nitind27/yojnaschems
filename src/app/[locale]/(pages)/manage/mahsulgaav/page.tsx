import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Mahasulgaavtitle from "@/app/[locale]/title/mahasulgaav";

import Mahsulgaav from "@/components/manage/Mahsulgaav";

import { grampanchayat, talukasdata, Villages } from "@/components/type";

import prisma from "@/lib/db";
import React from "react";

const page = async () => {
  let Villages: Villages[] = [];

  let talukas: talukasdata[] = []; // To store the fetched talukasData
  let grampanchayat: grampanchayat[] = [];

  let loading = true; // Initialize loading state

  try {
    grampanchayat = await prisma.grampanchayat.findMany();
    Villages = await prisma.villages.findMany(); // Fetch all QR codes
    talukas = await prisma.talukasData.findMany(); // Fetch talukas data here

    loading = false; // Set loading to false after data fetch
  } catch (error) {
    console.error("Error fetching QR codes:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'Mahsulgaav', href: '/manage/mahsulgaav' },
  ];
  return (
    <div>

      <h1 className="card card-body mt-5">  <TitleCard breadcrumbs={breadcrumbs} /></h1>
      <Mahsulgaav
        Villages={Villages}
        talukas={talukas}
        grampanchayat={grampanchayat}
      />
    </div>
  );
};

export default page;
