"use client"
import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Loader from "@/common/Loader ";
import PathHandler from "@/common/PathHandler";
import NbCard from "@/components/Dashboard/Nbscheme/NbCard";
import DashbordCard from "@/components/Dashboard/SchoolManage/DashbordCard";
import Thakkarcard from "@/components/Dashboard/Thakkarbappa/Thakkarcard";
import { useLocale } from "next-intl";
import Link from "next/link";
import Sports from "./Sports/Sports";


const DashboradMain = () => {
    const breadcrumbs = [

        { label: 'dashboard', href: '/dashboard' },

    ];


    const localActive = useLocale();

    const handleItemClick = (path: string) => {
        console.log('Pathname')
    }


    return (
        <div>
            {/* <p>coming soon...</p> */}
            <PathHandler>


                <div className="card mt-5 p-3 ">
                    <TitleCard breadcrumbs={breadcrumbs} />

                </div>
                <div className="">
                    <div className="row">
                        <div className="col-md-3 mt-5" onClick={() => handleItemClick(`/dashboard/nbschemes`)}>
                            <Link href={`/${localActive}/dashboard/nbschemes`}>
                                <NbCard />
                            </Link>
                        </div>
                        <div className="col-md-3 mt-5" onClick={() => handleItemClick(`dashboard/school`)}>
                            <Link href={`/${localActive}/dashboard/school`}>
                                <DashbordCard />
                            </Link>
                        </div>
                       
                        <div className="col-md-3 mt-5" onClick={() => handleItemClick(`/sports`)}>
                            <Link href={`/${localActive}/dashboard/sports`}>
                                <Sports />
                            </Link>
                        </div>
                    </div>
                </div>
            </PathHandler>
        </div>
    );
};

export default DashboradMain; // Ensure to export the renamed component
