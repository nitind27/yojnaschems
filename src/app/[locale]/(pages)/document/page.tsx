// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";

import Loader from "@/common/Loader ";
import Documentdata from "@/components/manage/Documentdata";

import { Document } from "@/components/type";
import prisma from "@/lib/db";
import { useTranslations } from "next-intl";
import React from "react";

const Page = async () => {
  let Documentdatas: Document[] = [];

  try {
    Documentdatas = await prisma.document.findMany(); 
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  if (!Documentdatas) {
    return (
      <>
        <Loader />
      </>
    )
  }
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'document', href: '/document' },
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

      <Documentdata Documentdata={Documentdatas} />
    </div>
  );
};

export default Page;
