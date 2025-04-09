// app/page.tsx
import Cluster from "@/app/[locale]/title/cluster"; import Loader from "@/common/Loader ";
;
import Clusteradd from "@/components/manage/Clusteradd";
import Notification from "@/components/manage/Notification";
import { Notificationdata } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";
import Notoficationtitle from "../../title/Notoficationtitle";
import TitleCard from "../../title/breadcums/Titilecard";

const Page = async () => {
  let notificationdata: Notificationdata[] = [];

  try {
    notificationdata = await prisma.notification.findMany(); // Fetch all clusters
  } catch (error) {
    console.error("Error fetching notification data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  if (!notificationdata) {
    return (
      <>
        <Loader />
      </>
    )
  }
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'notificaiton', href: '/notification' },
  ];
  const notificationfilterdata = notificationdata.filter((data) => data.status == "Start").map((data) => data)
  return (
    <div>

      <h1 className="card card-body mt-5">
        <TitleCard breadcrumbs={breadcrumbs} />
      </h1>
      <Notification initialnotificationdata={notificationfilterdata} />
    </div>
  );
};

export default Page;
