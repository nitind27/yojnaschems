// app/page.tsx
import Cluster from "@/app/[locale]/title/cluster"; import Loader from "@/common/Loader ";
;
import Clusteradd from "@/components/manage/Clusteradd";
import { clusterdata } from "@/components/type";
import prisma from "@/lib/db";
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

    return (
        <div>
            <h1 className="card card-body mt-5">
                <Cluster />
            </h1>

            <Clusteradd initialClusterData={clusterdata} />
        </div>
    );
};

export default Page;
