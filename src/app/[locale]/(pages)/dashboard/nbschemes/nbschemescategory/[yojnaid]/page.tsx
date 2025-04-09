import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Cluster from "@/app/[locale]/title/cluster";
import Nbschemescard from "@/components/Dashboard/Nbscheme/Nbschemescard";
import CardSchool from "@/components/Dashboard/SchoolManage/CardSchool";
import { SubCategory, YojanaMaster, YojanaYear } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async ({ params }: any) => {
  let subCategory: SubCategory[] = [];
  let yojnamaster: YojanaMaster[] = [];
  let yojnayear: YojanaYear[] = [];
  const { yojnaid } = params;

  try {
    subCategory = await prisma.subCategory.findMany();
    yojnamaster = await prisma.yojanaMaster.findMany();
    yojnayear = await prisma.yojanaYear.findMany();
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }
  const filteryojnayear = yojnayear
    .filter((y) => y.yojana_year_id == yojnaid)
    .map((y) => y.yojana_year);
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'nbschemes', href: '/dashboard/nbschemes' },
    { label: "", title: `${filteryojnayear}`, href: `/dashboard/nbschemes/nbschemescategory/${yojnaid}` },

  ];
  // Filter yojnamaster with additional conditions

  return (
    <div>

      <div className="container mt-5 card card-body col-lg-12">
        <div className=" d-flex justify-content-between ">

          <div>

            <TitleCard breadcrumbs={breadcrumbs} />
          </div>
{/* 
          <h3>


            वर्ष {filteryojnayear}
          </h3> */}

        </div>
      </div>
      <div className="container mt-5">
        <div className="row col-lg-12">
          {subCategory
            .filter((d) => d.category_id === 2 && d.status == "Active") // First filter the categories
            .map((categoryName, index) => {
              // For each filtered category, filter yojnamaster
              const filteryojnamaster = yojnamaster.filter(
                (d) =>
                  d.yojana_year_id == yojnaid &&
                  d.category_id === 2 &&
                  d.status !== "Deactive" &&
                  d.sub_category_id == categoryName.sub_category_id
              );

              return (
                <div key={index} className="col-md-3 mb-4">
                  <Nbschemescard
                    yojnaname={categoryName.sub_category_name} // Display the sub-category name
                    yojnacount={filteryojnamaster.length} // Count of filtered yojnamaster
                    yojnaid={yojnaid}
                    subcategoryid={categoryName.sub_category_id}
                    filteryojnayear={filteryojnayear}
                  />
                </div>
              );
            })}
        </div>
      </div>
    </div>
  );
};

export default Page;
