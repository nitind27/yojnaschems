"use client";
import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { Schooldata, Standarddata, StudentData, tblstudentsscholarship } from "../type";
import { toast } from "react-toastify";

import { useTranslations } from "next-intl";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { createConfirmation } from "react-confirm";
import TableOption from "../table/TableOption";
import { formatDate } from "@/lib/utils";

import StudentAddData from "./StudentAddData";
import Image from "next/image";
import Studentlistinsert from "./Studentlistinsert";
import { useScholarship } from "../table/ScholarshipContext";
import { clippingParents } from "@popperjs/core";
type Props = {
  initialstudentData: StudentData[];
  schooldata: Schooldata[];
  standarddata: Standarddata[];
  scholarship: tblstudentsscholarship[];
};

const Student = ({ initialstudentData, schooldata, standarddata, scholarship }: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [serialnumber, setSerialnumber] = useState("");
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [grno, setGrno] = useState("");
  const [saralid, setSaralId] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [schoolname, setSchoolname] = useState("");
  const [standard, setStandard] = useState("");
  const [mothername, setMontherName] = useState("");
  const [dob, setDob] = useState("");
  const [gender, setGender] = useState("");
  const [cast, setCast] = useState("");
  const [aadhaar, setAadhaar] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [address, setAddress] = useState("");
  const [sicklecell, setSicklecell] = useState("");
  const [sicklereport, setsickleReport] = useState("");
  const [error, setError] = useState<string>("");
  const [updateTownId, setUpdateTownId] = useState<number | null>(null);

  const [selectedStudents, setSelectedStudents] = useState<number[]>([]);


  const [studentdata, setstudentdata] =
    useState<StudentData[]>(initialstudentData);
  const t = useTranslations("student");
  const confirm = createConfirmation(ConfirmationDialog);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [filterscholarship, setFilterscholarship] = useState("");

  const handlescholarshipFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setFilterscholarship(e.target.value);

  };
  const schoolmap = schooldata.reduce((acc, school: Schooldata) => {
    acc[school.school_id] = school.school_name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);
  const standardmap = standarddata.reduce((acc, standard: Standarddata) => {
    acc[standard.standard_id] = standard.standard_name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);
  const data = studentdata
    .map((student) => ({
      student_id: student.student_id,
      serial_number: student.serial_number,
      uid: student.uid,
      gr_no: student.gr_no,
      date_of_admision: student.date_of_admision,
      year_add: student.year_add,
      school_id: schoolmap[student.school_id as any],
      schoolid: student.school_id,
      admited_in_std: student.admited_in_std,
      current_std: standardmap[student.current_std as any],
      currentstd: student.current_std,
      division: student.division,
      first_name: student.first_name + " " + student.last_name,
      middle_name: student.middle_name,
      last_name: student.last_name,
      date_of_birth: typeof student.date_of_birth === "string"
        ? formatDate(student.date_of_birth)
        : formatDate(student.date_of_birth as any),

      place_of_birth: student.place_of_birth,
      gender: student.gender,
      mother_name: student.mother_name,
      religion: student.religion,
      lang_id: student.lang_id,
      cast: student.cast,
      address: student.address,
      contact_no: student.contact_no,
      full_name: student.full_name,
      user_id: student.user_id,
      cluster_id: student.cluster_id,
      dropout: student.dropout,
      dropout_date_time: student.dropout_date_time,
      status: student.status,
      type_of_students: student.type_of_students,
      saral_id: student.saral_id,
      date_leave: student.date_leave,
      remarks: student.remarks,
      stream: student.stream,
      profile_photo: student.profile_photo,
      sickle_cell: student.sickle_cell,
      aadhaar: student.aadhaar,
      sickle_report: student.sickle_report,
    }))
    .reverse();
  const handleCheckboxChange = (studentId: number) => {
    setSelectedStudents((prev) =>
      prev.includes(studentId)
        ? prev.filter(id => id !== studentId)
        : [...prev, studentId]
    );
  };
  const ab = scholarship.map((f) => f.student_scholarship_id);
  const formattedScholarshipIDs = ab.join(', ');

  const scholarshipname = scholarship.map((f) => f.scholarship_name);
  const formattedScholarshipname = scholarshipname.join(', ');


  const columns = [

    {
      accessorKey: "serial_number", // Use a new accessor for the serial number
      header: `${t("SrNo")}`, // Header for the serial number
      cell: ({ row }: any) => (
        <div>
          {row.index + 1} {/* Display the index + 1 for serial number */}
        </div>
      ),
    },
    {
      accessorKey: "profile_photo",
      header: `Check`,
      cell: ({ row }: any) => {

        return (
          <>
            <Studentlistinsert formattedScholarshipIDs={formattedScholarshipIDs} studentid={row.original.student_id} filterscholarship={filterscholarship} updateTownId={updateTownId} formattedScholarshipname={formattedScholarshipname} scholarship={scholarship} />
          </>
        );
      },
    },
    {
      accessorKey: "gr_no",
      header: `${t("grno")}`,
    },
    {
      accessorKey: "full_name",
      header: `${t("studentName")}`,
    },
    {
      accessorKey: "profile_photo",
      header: `${t("image_urls")}`,
      cell: ({ row }: any) => {
        const photoSrc = row.original.profile_photo && row.original.profile_photo.startsWith("/")
          ? row.original.profile_photo
          : `/${row.original.profile_photo}`;

        const notfound = "/media/img/imgenotfound.jpg";
        return (
          <div style={{ textAlign: "center" }}>
            <Image
              src={photoSrc}
              alt={t("image_urls")}
              style={{ objectFit: "cover" }}
              height={100} // Adjust size as needed
              width={100}
            />
            <br />
            {/* <Link href={photoSrc} target="_blank" rel="noopener noreferrer">
                view
              </Link> */}
          </div>
        );
      },
    },
    {
      accessorKey: "school_id",
      header: `${t("Schoolname")}`,
    },
    {
      accessorKey: "current_std",
      header: `${t("std")}`,
    },

    {
      accessorKey: "uid",
      header: `${t("saralid")}`,
    },
    {
      accessorKey: "mother_name",
      header: `${t("Monthername")}`,
    },
    {
      accessorKey: "date_of_birth",
      header: `${t("dob")}`,
    },

    {
      accessorKey: "gender",
      header: `${t("gender")}`,
    },
    {
      accessorKey: "cast",
      header: `${t("cast")}`,
    },
    {
      accessorKey: "aadhaar",
      header: `${t("aadharcard")}`,
    },
    {
      accessorKey: "contact_no",
      header: `${t("Contact")}`,
    },
    {
      accessorKey: "address",
      header: `${t("address")}`,
    },
    {
      accessorKey: "sickle_cell",
      header: `${t("sicklecell")}`,
    },
    {
      accessorKey: "sickle_report",
      header: `${t("status")}`,
    },

    {
      accessorKey: "actions",
      header: `${t("Action")}`,
      cell: ({ row }: any) => (
        <div style={{ display: "flex", whiteSpace: "nowrap" }}>



          <StudentAddData values={{
            serialnumber: row.original.serial_number,
            studentId: row.original.student_id,
            studentName: row.original.full_name,
            grno: row.original.gr_no,
            saralid: row.original.uid,
            isLoading: false,
            schoolname: row.original.schoolid,
            standard: row.original.currentstd,
            mothername: row.original.mother_name,
            dob: row.original.date_of_birth,
            gender: row.original.gender,
            cast: row.original.cast,
            aadhaar: row.original.aadhaar,
            contactNo: row.original.contact_no,
            address: row.original.address,
            sicklecell: row.original.sickle_cell,
            sicklereport: row.original.sickle_report,
            error: "", // Added error handling
            updateTownId: row.original.student_id
          }} schooldata={schooldata} standarddata={standarddata} setStudentData={setstudentdata} />

          <button
            className={`btn btn-sm ${row.original.status === "Active" ? "btn-danger" : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.student_id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === "Active"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
          <button
            className="btn btn-sm btn-primary ms-5"
            onClick={() => handleImageClick(row.original.student_id)}
          >
            Upload Image
          </button>
        </div>
      ),
    },
  ];
  const handleImageClick = (studentId: any) => {
    // Open file input to select image
    setStudentId(studentId);
    document.getElementById("fileInput")?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && studentId) {
      setSelectedFile(file);
      await uploadImage(studentId as any, file);
    }
  };

  const uploadImage = async (studentId: number, file: File) => {

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`/api/student/upload/${studentId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Image uploaded successfully!");

        // Update the school data with the new image URL
        const updatedData = studentdata.map((school) =>
          school.student_id == studentId
            ? { ...school, profile_photo: data.profile_photo }
            : school
        );
        console.log('fsdafee', updatedData)
        setstudentdata(updatedData);
      } else {
        toast.error(data.error || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image.");
    }
  };
  const handleDeactivate = async (
    student_id: number | string,
    currentStatus: string
  ) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this Student?"
        : "Are you sure you want to activate this Student?";
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const newStatus = currentStatus === "Active" ? "Deactive" : "Active";

        const response = await fetch(`/api/student/delete/${student_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          setstudentdata((prevData) =>
            prevData.map((school) =>
              school.student_id === student_id
                ? { ...school, status: newStatus }
                : school
            )
          );
          toast.success(
            `School ${newStatus === "Active" ? "activated" : "deactivated"
            } successfully!`
          );
        } else {
          const errorData = await response.json();
          toast.error(
            `Failed to change the cluster status: ${errorData.error || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error changing the cluster status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };
  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    resetForm();
  };

  const resetForm = () => {
    setSerialnumber("");
    setStudentName("");
    setGrno("");
    setSaralId("");
    setSchoolname("");
    setStandard("");
    setMontherName("");
    setDob("");
    setGender("");
    setCast("");
    setAadhaar("");
    setContactNo("");
    setAddress("");
    setSicklecell("");
    setError("");
    setUpdateTownId(null);
  };


  const handleimage = (school: any) => {
    alert(school.student_id);
  };
  const retrievedSchoolName = localStorage.getItem("schoolName");
  const retrievedDisplayedNumber = localStorage.getItem("displayedNumber");

  let options;

  if (retrievedDisplayedNumber) {

    options = [
      {
        value: retrievedDisplayedNumber,
        label: retrievedDisplayedNumber,
      },
    ];
  } else {

    options = standarddata.map((std) => ({
      value: std.standard_name,
      label: std.standard_name,
    }));
  }


  let schoolnameoption;


  if (retrievedSchoolName) {

    schoolnameoption = [
      {
        value: retrievedSchoolName,
        label: retrievedSchoolName,
      },
    ];
  } else {

    schoolnameoption = schooldata.map((student) => ({
      value: student.school_name,
      label: student.school_name,
    }));
  }
  let scholarshipoption;


  if (retrievedSchoolName) {

    scholarshipoption = [
      {
        value: retrievedSchoolName,
        label: retrievedSchoolName,
      },
    ];
  } else {

    scholarshipoption = [{
      label: "नवोदय",
      value: "नवोदय",

    },
    {
      label: "शिष्यवृत्ती 5 वी",
      value: "शिष्यवृत्ती 5 वी",

    },
    {
      label: "शिष्यवृत्ती 8 वी",
      value: "शिष्यवृत्ती 8 वी",

    },
    {
      label: "विभागीय क्रीडा स्पर्धा",
      value: "विभागीय क्रीडा स्पर्धा",

    },
    {
      label: "राज्यस्तरीय क्रीडा स्पर्धा",
      value: "राज्यस्तरीय क्रीडा स्पर्धा",

    },
    {
      label: "खासदार क्रीडा महोत्सव",
      value: "खासदार क्रीडा महोत्सव",

    },
    {
      label: "संगीत",
      value: "संगीत",

    },
    {
      label: "कला",
      value: "कला",

    },
    {
      label: "शालेय विभागीय क्रीडा स्पर्धा",
      value: "शालेय विभागीय क्रीडा स्पर्धा",

    },
    ]

  }


  return (
    <div>
      {/* {selectedScholarship} */}
      <TableOption
        data={data}
        columns={columns}
        filterOptions={options}
        additionalFilterOptions={schoolnameoption}
        scholarshipoption={scholarshipoption}
        Button={
          <StudentAddData values={{
            serialnumber: "",
            studentId: "",
            studentName: "",
            grno: "",
            saralid: "",
            isLoading: false,
            schoolname: "",
            standard: "",
            mothername: "",
            dob: "",
            gender: "",
            cast: "",
            aadhaar: "",
            contactNo: "",
            address: "",
            sicklecell: "No",
            sicklereport: "",
            error: "", // Added error handling
            updateTownId: null
          }} schooldata={schooldata} standarddata={standarddata} setStudentData={setstudentdata} />
        }
      />


      <input
        type="file"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
        accept="image/*"
      />
    </div>
  );
};

export default Student;
