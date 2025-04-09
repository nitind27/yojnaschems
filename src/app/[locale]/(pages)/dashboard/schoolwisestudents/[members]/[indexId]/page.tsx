import TitleCard from "@/app/[locale]/title/breadcums/Titilecard";
import Cluster from "@/app/[locale]/title/cluster";
import CardSchool from "@/components/Dashboard/SchoolManage/CardSchool";
import { Patsankhya, Schooldata, StudentData } from "@/components/type";
import prisma from "@/lib/db";
import React from "react";

const Page = async ({ params }: any) => {
  const { members } = params;
  const { indexId } = params;
  let studentdata: StudentData[] = [];
  let schooldata: Schooldata[] = [];
  let patsankya: Patsankhya[] = [];

  try {
    schooldata = await prisma.school.findMany();
    studentdata = await prisma.student.findMany(); // Fetch all students
    patsankya = await prisma.patsankhya.findMany(); // Fetch all students
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }
  const filtercurrunschool = schooldata.filter(
    (student) => student.school_id == indexId
  );
  const schoolname = filtercurrunschool.map((f) => f.school_name);
  const totalstudent = filtercurrunschool.map((f) => f.pat_sankhya);

  const filteredStudents = studentdata.filter(
    (student) => student.school_id == indexId // Use the current school's ID
  );
  const breadcrumbs = [

    { label: 'dashboard', href: '/dashboard' },
    { label: 'school', href: '/dashboard/school' },
    { label: 'schoolwisestudents', href: `/dashboard/schoolwisestudents/${members}/${indexId}` },

  ];
  return (
    <div>
      <div className="container mt-5 card card-body col-lg-12 mb-5">
        <div className=" d-flex justify-content-between ">

          <div>

            <TitleCard breadcrumbs={breadcrumbs} />
          </div>

          <h3>


            {schoolname}-{filteredStudents.length}/{totalstudent}
          </h3>

        </div>
      </div>


      <div className="container mt-5">
        <div className="row col-lg-12">
          {Array.from({ length: members }, (_, index) => {
            // Filter students for the current member's school ID and standard ID

            const filteredStudents = patsankya.filter(
              (student) =>
                student.school_id == indexId && // Filter by school ID
                student.standard_id == index + 1 // Filter by standard ID
            );

            // Map filtered students to their respective sankhya values
            const studentSankhya = filteredStudents.map((f, index) => (
              <span key={index}>{f.sankhya}</span> // Assuming each `Patsankhya` has a unique `id`
            ));
            const filtercurruntstudent = studentdata.filter(
              (student) =>
                student.school_id == indexId &&
                student.current_std === index + 1
            );

            const curruntstudentSankhya = filtercurruntstudent.map(
              (f, index) => (
                <span key={index}>{f.student_id}</span> // Assuming each `Patsankhya` has a unique `id`
              )
            );
            const filtercurrunschool = schooldata.filter(
              (student) => student.school_id == indexId
            );

            return (
              <div key={index} className="col-md-3 mb-2">
                <CardSchool
                  members={index + 1}
                  index={index}
                  patsankya={studentSankhya}
                  schooldata={filtercurrunschool}
                  studentdata={curruntstudentSankhya.length}
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
