"use client"
import React, { useState } from "react";
// import CardSchool from "./CardSchool";
import Card from "@/common/Card";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Schooldata, Standarddata, StudentData, TblSportsInfoNew } from "@/components/type";
import * as XLSX from 'xlsx';


type Props = {
    members: any,
    schoolname: any,
    totalstudent: any,
    curruntstudent: any,
    stddata: any,
    index: any,
    sportsinfo: TblSportsInfoNew[],
    studentdata: StudentData[];
    schooldata: Schooldata[];
    standarddata: Standarddata[];
};

const SportDashboard = ({
    members,
    schoolname,
    totalstudent,
    curruntstudent,
    stddata,
    index,
    studentdata, schooldata, standarddata,
    sportsinfo
}: Props) => {
    const localActive = useLocale();

    const [clusterData, setClusterData] =
        useState<TblSportsInfoNew[]>(sportsinfo); // State 

    const students = studentdata.reduce((acc, student: any) => {
        acc[student.student_id] = student.full_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const schools = schooldata.reduce((acc, school: any) => {
        acc[school.school_id] = school.school_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const standardmap = standarddata.reduce((acc, standard: Standarddata) => {
        acc[standard.standard_id] = standard.standard_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const data = clusterData
        .map((cluster) => ({
            sports_info_id: cluster.sports_info_id,
            std: standardmap[cluster.sports_record.split("|")[3] as any],
            studentname: cluster.sports_record.split("|")[2],
            student_name: students[cluster.sports_record.split("|")[2] as any],
            stdname: cluster.sports_record.split("|")[0],
            std_name: schools[cluster.sports_record.split("|")[0] as any],
            status: cluster.status,
            //   ins_date_time:
            //     typeof cluster.update_date_time === "string"
            //       ? formatDate(cluster.update_date_time)
            //       : formatDate(cluster.update_date_time.toISOString()),
        }))
        .reverse();
    const downloadExcel = () => {
        // Transform data for better compatibility with Excel
        const transformedData = data.map((student, index) => ({
            Index: index + 1, // Adding index number starting from 1
            FullName: student.student_name, // Join names and filter nulls
            SchoolName: student.std_name, // Join contact numbers or default to "N/A"
            Std: student.std, // Join array into a string
            // Default value for scholarship name
        }));

        // Define custom headings as an array of strings
        const headings = [
            "Index",
            "Full Name",
            "School Name",
            "Standard",

        ];

        // Combine headings with transformed data
        const finalData = [headings, ...transformedData.map(({ Index, FullName, SchoolName, Std }) =>
            [Index, FullName, SchoolName, Std])];

        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(finalData); // Use aoa_to_sheet for array of arrays
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sports");

        // Write file
        XLSX.writeFile(workbook, "Sports.xlsx");
    };

    return (
        <div>
          
            <Link
                href={`/${localActive}/dashboard/sportwise/${members}/${schoolname}`}
            // href={"/"}
            >
                <Card
                    title={schoolname + " " + "(" + curruntstudent + ")"}
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
                                        <img src={totalstudent} alt="" height={30} />

                                        {/* Total Students : {curruntstudent} / {totalstudent} */}
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

export default SportDashboard;
