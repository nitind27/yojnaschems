"use client"
import React, { useState } from "react";
// import CardSchool from "./CardSchool";
import Card from "@/common/Card";
import Link from "next/link";
import { useLocale } from "next-intl";
import { Schooldata, Standarddata, StudentData, TblAchivments, TblSports, TblSportsInfoNew } from "@/components/type";
import * as XLSX from 'xlsx';


type Props = {
    members: any,
    sportsdata: TblSports[],
    totalstudent: any,
    curruntstudent: any,
    stddata: any,
    index: any,
    sportsinfo: TblSportsInfoNew[],
    studentdata: StudentData[];
    schooldata: Schooldata[];
    standarddata: Standarddata[];
    TblAchivments: TblAchivments[];

};

const Sportsexcle = ({
    members,
    sportsdata,
    totalstudent,
    curruntstudent,
    stddata,
    index,
    studentdata, schooldata, standarddata,
    sportsinfo, TblAchivments

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
    const sportsnames = sportsdata.reduce((acc, school: TblSports) => {
        acc[school.sports_id] = school.sports_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const standardmap = standarddata.reduce((acc, standard: Standarddata) => {
        acc[standard.standard_id] = standard.standard_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const TblAchivmentdata = TblAchivments.reduce((acc, standard: TblAchivments) => {
        acc[standard.achivment_id] = standard.levels; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const data = clusterData
        .map((cluster) => {
            const recordParts = cluster.sports_record.split("|");
            const sportsIds = recordParts[0].split(",").map((id) => id.trim()); // Split IDs by comma

            return {
                sports_info_id: cluster.sports_info_id,
                sportsid: sportsIds.map((id) => sportsnames[id as any]).join(", "), // Map each ID and join the results
                std: standardmap[recordParts[3] as any],
                achivement: TblAchivments.filter((data) => data.achivment_id == cluster.sports_info_id).map((data) => data.details),
                achivementplayertime: TblAchivments.filter((data) => data.achivment_id == cluster.sports_info_id).map((data) => data.player_time),
                achivementwinnigtime: TblAchivments.filter((data) => data.achivment_id == cluster.sports_info_id).map((data) => data.winning_time),
                achivementstatelavel: TblAchivments.filter((data) => data.achivment_id == cluster.sports_info_id).map((data) => data.state_level),
                studentname: recordParts[2],
                student_name: students[recordParts[2] as any],
                stdname: recordParts[0],
                std_name: schools[recordParts[0] as any], // Note: This might not work as expected if stdname contains multiple IDs
                status: cluster.status,
            };
        })
        .reverse();

    const downloadExcel = () => {
        // Transform data for better compatibility with Excel
        const transformedData = data.map((student, index) => ({
            Index: index + 1, // Adding index number starting from 1
            FullName: student.student_name, // Join names and filter nulls
            SchoolName: student.std_name, // Join contact numbers or default to "N/A"
            Std: student.std, // Join array into a string
            sportsid: student.sportsid, // Join array into a string
            achivement: student.achivement, // Join array into a string
            achivementplayertime: student.achivementplayertime, // Join array into a string
            achivementwinnigtime: student.achivementwinnigtime, // Join array into a string
            achivementstatelavel: student.achivementstatelavel, // Join array into a string
            // Default value for scholarship name
        }));

        // Define custom headings as an array of strings
        const headings = [
            "Index",
            "Full Name",
            "School Name",
            "Standard",
            "Sports Name",
            "Achievement",
            "Player Time",
            "Wining Time",
            "State Level"

        ];

        // Combine headings with transformed data
        const finalData = [headings, ...transformedData.map(({ Index, FullName, SchoolName, Std, sportsid, achivement, achivementplayertime, achivementwinnigtime, achivementstatelavel }) =>
            [Index, FullName, SchoolName, Std, sportsid, achivement,achivementplayertime,achivementwinnigtime,achivementstatelavel])];

        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(finalData); // Use aoa_to_sheet for array of arrays
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sports");

        // Write file
        XLSX.writeFile(workbook, "Sports.xlsx");
    };

    return (
        <div>
            <button onClick={downloadExcel} className="btn btn-primary btn-sm">
                Download Excel
            </button>

        </div>
    );
};

export default Sportsexcle;
