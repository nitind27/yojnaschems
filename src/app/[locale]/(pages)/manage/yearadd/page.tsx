// app/page.tsx
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Categorytitle from "@/app/[locale]/title/category";
import Cluster from "@/app/[locale]/title/cluster"; import Loader from "@/common/Loader ";

import Clusteradd from "@/components/manage/Clusteradd";
import Category from "@/components/Schemes/Category";
import Yearmaster from "@/components/Schemes/Yearmaster";
import { Categorys, YojanaYear } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async () => {
    let yojnayear: YojanaYear[] = [];

    try {
        yojnayear = await prisma.yojanaYear.findMany(); // Fetch all clusters
    } catch (error) {
        console.error("Error fetching cluster data:", error);
        return (
            <div>
                <h1>Error fetching Data</h1>
            </div>
        );
    }

    if (!yojnayear) {
        return (
            <>
                <Loader />
            </>
        )
    }
    const breadcrumbs = [

        { label: 'dashboard', href: '/dashboard' },
        { label: 'year', href: '/manage/yearadd' },
    ];
    return (
        <div>

            <h1 className="card card-body mt-5">
                <TitleCard breadcrumbs={breadcrumbs} />
            </h1>

            <Yearmaster initialcategoryData={yojnayear} />
        </div>
    );
};

export default Page;
