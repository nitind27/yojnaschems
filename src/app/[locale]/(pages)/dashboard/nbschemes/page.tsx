import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import NbSchemes from "@/components/Dashboard/Nbscheme/NbSchemes";
import { YojanaYear } from "@/components/type";
import prisma from "@/lib/db";

const page = async () => {
  let yojnayear: YojanaYear[] = [];
  try {
    yojnayear = await prisma.yojanaYear.findMany();
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  // Sort the yojnayear array in descending order based on the starting year
  yojnayear.sort((a, b) => {
    const yearA = parseInt(a.yojana_year.split("-")[0]); // Extract the starting year
    const yearB = parseInt(b.yojana_year.split("-")[0]); // Extract the starting year
    return yearB - yearA; // Sort in descending order
  });
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'nbschemes', href: '/dashboard/nbschemes' },

  ];
  const yojnayearfilter = yojnayear.filter((data)=>data.year_status == "Y")
  return (
    <div>
      <div className="card mt-5 p-3 ">

        <TitleCard breadcrumbs={breadcrumbs} />
      </div>
      <div className=" mt-5">
        <div className="row ">
          {yojnayearfilter.map((school, index) => {
            return (
              <div className="col-md-3 mb-2" key={index}>
                <NbSchemes
                  yojnaid={school.yojana_year_id}
                  yojanaYear={school.yojana_year} // You might want to fetch this data as well
                />
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default page;
