import React from "react";
import CardSchool from "./CardSchool";
import Card from "@/common/Card";
import Link from "next/link";
import { useLocale } from "next-intl";

const SchoolDashboard = ({
  members,
  schoolname,
  totalstudent,
  curruntstudent,
  stddata,
  index,
}: any) => {
  const localActive = useLocale();

  // Function to calculate total or last number based on stddata
  const getStudentCount = (data: string) => {
    // Check if stddata is in the format 'start-end'
    const match = data.match(/^(\d+)-(\d+)$/);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = parseInt(match[2], 10);
      // Return total count or last number based on your requirement
      return end; // Change to (end - start + 1) if you want total count
    }
    // If stddata is not in expected format, return it as is
    return data;
  };

  const studentCountDisplay = getStudentCount(stddata);

  return (
    <div>
      <Link
        href={`/${localActive}/dashboard/schoolwisestudents/${studentCountDisplay}/${index}`}
      >
        <Card
          title={schoolname}
          backgroundColor="#F9BA17"
          content={
            <>
              <div className="d-flex justify-content-between fs-6  w-100 ">
                <span
                  style={{
                    fontSize: "18px",
                  }}
                >
                  <div>
                    Total Students : {curruntstudent} / {totalstudent}
                  </div>
                </span>
              </div>
            </>
          }
        />
      </Link>
    </div>
  );
};

export default SchoolDashboard;
