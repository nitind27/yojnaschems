import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import SchoolDashboard from "@/components/Dashboard/SchoolManage/SchoolDashboard";
import { Schooldata, StudentData } from "@/components/type";
import prisma from "@/lib/db";

const page = async () => {
  let studentdata: StudentData[] = [];
  let schooldata: Schooldata[] = [];
  try {
    schooldata = await prisma.school.findMany();
    studentdata = await prisma.student.findMany(); // Fetch all students
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
    { label: 'school', href: '/dashboard/school' },

  ];
  return (
    <div>
      <div className="card mt-5 p-3">
        <TitleCard breadcrumbs={breadcrumbs} />

      </div>
      <div className="container mt-5">
        <div className="row col-lg-12">
          {schooldata.map((school, index) => {
            // Filter students for the current school
            const filteredStudents = studentdata.filter(
              (student) => student.school_id === school.school_id // Use the current school's ID
            );

            return (
              <div className="col-md-3 mb-2" key={index}>
                <SchoolDashboard
                  members={school.school_id} // Assuming you will populate this later
                  schoolname={school.school_name} // Use the school_name property
                  totalstudent={school.pat_sankhya} // You might want to fetch this data as well
                  curruntstudent={filteredStudents.length} // Count of current students for this school
                  stddata={school.stds}
                  index={index + 1}
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
