"use client";
import React, { useEffect } from "react";
import Card from "@/common/Card";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const CardSchool = ({
  members,
  index,
  patsankya,
  schooldata,
  studentdata,
}: {
  members: number;
  index: any;
  patsankya: any;
  schooldata: any;
  studentdata: any;
}) => {
  const localActive = useLocale();

  // Clear localStorage on component mount
  useEffect(() => {
    localStorage.removeItem("schoolName");
    localStorage.removeItem("displayedNumber");
  }, []);

  // Function to determine the displayed number based on members
  const getDisplayedNumber = (members: number): string => {
    const ordinalSuffix = getOrdinalSuffix(members);

    if (members === 11) {
      return `11${ordinalSuffix} Arts`;
    } else if (members === 12) {
      return `12${ordinalSuffix} Arts`;
    } else if (members === 13) {
      return `11${ordinalSuffix} Science`;
    } else if (members === 14) {
      return `12${ordinalSuffix} Science`;
    }

    // Handle cases for numbers from 1 to 10
    if (members >= 1 && members <= 10) {
      return `${members}${ordinalSuffix}`;
    }

    // Default case for numbers greater than 14
    return `${members}`;
  };

  // Function to get ordinal suffix
  const getOrdinalSuffix = (number: number): string => {
    const suffixes = ["th", "st", "nd", "rd"];
    const value = number % 100;

    // Determine the correct suffix based on the last digit and last two digits
    if (value >= 11 && value <= 13) {
      return suffixes[0]; // Special case for '11th', '12th', '13th'
    }

    return suffixes[value % 10] || suffixes[0];
  };

  const displayedNumber = getDisplayedNumber(members);

  // Function to handle card click
  const handleCardClick = () => {
    const schoolName = schooldata
      .map((school: any) => school.school_name)
      .join(", "); // Join array into a string

    // Store in localStorage
    localStorage.setItem("schoolName", schoolName);
    localStorage.setItem("displayedNumber", displayedNumber);
  };

  return (
    <div>
      <Link href={`/${localActive}/manage/student`} onClick={handleCardClick}>
        <Card
          title={`Standard : ${displayedNumber}`}
          backgroundColor="#F9BA17"
          content={
            <>
              <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100">
                <span style={{ fontSize: "20px" }}>
                  Students : {studentdata}/{patsankya}
                </span>
              </div>
            </>
          }
        />
      </Link>
    </div>
  );
};

export default CardSchool;
