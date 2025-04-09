// import { KTIcon } from '@/_metronic/helpers';
// import ComponentFile from '@/common/ComponentFile';
// import { useTranslations } from 'next-intl';
// import React, { useState } from 'react'
// import { Button } from 'react-bootstrap';
// import { Schooldata, Standarddata } from '../type';
// import { toast } from "react-toastify";


// const StudentAddData = ({ values,
//     schooldata,
//     standarddata,
//     setStudentData, // Add setStudentData here
// }: { values: any, schooldata: any, standarddata: any, setStudentData: React.Dispatch<React.SetStateAction<any[]>> }) => {
//     const [showmodel, setShowModel] = useState(false)
//     const t = useTranslations("student");

//     const [isLoading, setIsLoading] = useState(false);
//     const [sicklecell, setSicklecell] = useState("");
//     const handleSubmit = async (formData: any) => {
//         setIsLoading(true);
//         const dob = new Date(formData.dob);

//         const bodyData = {
//             student_id: values.studentId || undefined, // Include if updating
//             serial_number: formData.serialnumber,
//             full_name: formData.studentName,
//             gr_no: formData.grno,
//             uid: formData.saralid,
//             school_id: formData.schoolname,
//             current_std: formData.standard,
//             mother_name: formData.mothername,
//             date_of_birth: dob,
//             gender: formData.gender,
//             cast: formData.cast,
//             aadhaar: formData.aadhaar,
//             contact_no: formData.contactNo,
//             address: formData.address,
//             sickle_cell: formData.sicklecell,
//             sickle_report: formData.sicklecell === "Yes" ? formData.sicklereport : "",
//         };

//         try {
//             const method = values.updateTownId ? "PUT" : "POST";
//             const url = values.updateTownId
//                 ? `/api/student/update`
//                 : `/api/student/insert`;

//             const response = await fetch(url, {
//                 method,
//                 headers: {
//                     "Content-Type": "application/json",
//                 },
//                 body: JSON.stringify(bodyData),
//             });

//             if (response.ok) {
//                 const message = values.updateTownId ? "updated" : "added";
//                 toast.success(`Student ${message} successfully!`);

//                 const updatedStudent = await response.json();
//                 if (values.student_id) {
//                     // Update existing student in local state
//                     setStudentData((prevData: any) =>
//                         prevData.map((student: any) =>
//                             student.student_id === values.student_id
//                                 ? { ...student, ...updatedStudent }
//                                 : student
//                         )
//                     );
//                 } else {
//                     // Add new student to local state
//                     setStudentData((prevData) => [...prevData, updatedStudent]);
//                 }

//                 setShowModel(false); // Close modal
//             } else {
//                 const error = await response.json();
//                 // toast.error(`Failed to save student: ${error.message}`);
//             }
//         } catch (error) {
//             console.error("Submission error:", error);
//             toast.error("An unexpected error occurred.");
//         } finally {
//             setIsLoading(false);
//         }
//     };



//     const formFields = [
//         {
//             label: `${t("serialnumber")}`,
//             value: values.serialnumber, name: "serialnumber",
//             type: "text",
//             required: true,
//             placeholder: `${t("serialnumber")}`,
//         },
//         {
//             label: `${t("studentName")}`,
//             value: values.studentName,
//             type: "text",
//             name: "studentName",
//             required: true,
//             placeholder: `${t("studentName")}`,
//         },
//         {
//             label: `${t("grno")}`,
//             value: values.grno,
//             type: "text",
//             name: "grno",
//             required: true,
//             placeholder: `${t("grno")}`,
//         },
//         {
//             label: `${t("saralid")}`,
//             value: values.saralid,
//             required: true,
//             name: "saralid",
//             type: "text",
//             placeholder: `${t("saralid")}`,
//         },
//         {
//             label: `${t("Schoolname")}`,
//             required: true,
//             name: "schoolname",
//             value: values.schoolname || "", // Default value when updating
//             type: "select",
//             options: schooldata.map((student: Schooldata) => ({
//                 value: student.school_id,
//                 label: student.school_name,
//             })),
//             placeholder: `${t("Schoolname")}`, // Optional placeholder for select input
//         },
//         {
//             label: `${t("std")}`,
//             required: true,
//             name: "standard",
//             value: values.standard || "",
//             type: "select",
//             options: standarddata.map((std: Standarddata) => ({
//                 value: std.standard_id,
//                 label: std.standard_name,
//             })),
//             placeholder: `${t("std")}`,
//         },
//         {
//             label: `${t("Monthername")}`,
//             value: values.mothername,
//             name: "mothername",
//             required: true,
//             type: "text",
//             placeholder: `${t("Monthername")}`,
//         },
//         {
//             label: `${t("dob")}`,
//             value: values.dob,
//             name: "dob",
//             required: true,
//             type: "date",
//             placeholder: `${t("dob")}`,
//         },

//         {
//             label: `${t("gender")}`,
//             value: values.gender,
//             name: "gender",
//             type: "select",
//             placeholder: `${t("gender")}`,
//             options: [
//                 { label: "Male", value: "M" },
//                 { label: "Female", value: "F" },
//                 { label: "Other", value: "Oth" },
//                 // Add other options here if needed
//             ],
//         },

//         {
//             label: `${t("cast")}`,
//             value: values.cast,
//             name: "cast",
//             type: "select",
//             placeholder: `${t("cast")}`,
//             options: [
//                 { label: "SC", value: "SC" },
//                 { label: "ST", value: "ST" },
//                 { label: "OBC", value: "OBC" },
//                 { label: "SBC", value: "SBC" },
//                 { label: "NT B", value: "NT B" },
//                 { label: "General", value: "General" },
//                 // Add other options here if needed
//             ],
//         },

//         {
//             label: `${t("aadharcard")}`,
//             value: values.aadhaar,
//             name: "aadhaar",
//             required: true,
//             type: "text",
//             placeholder: `eg. 121212121212`,
//         },

//         {
//             label: `${t("Contact")}`,
//             value: values.contactNo,
//             name: "contactNo",
//             required: true,
//             type: "text",
//             placeholder: `eg.7359595959`,
//         },
//         {
//             label: `${t("address")}`,
//             value: values.address,
//             name: "address",
//             required: true,
//             type: "text",
//             placeholder: `${t("address")}`,
//         },

//         {
//             label: `${t("sicklecell")}`,
//             value: values.sicklecell,
//             name: "sicklecell",
//             type: "select",
//             placeholder: `${t("sicklecell")}`,
//             options: [
//                 { label: "Yes", value: "Yes" },
//                 { label: "No", value: "No" },
//             ],
//             onChange: (e: React.ChangeEvent<HTMLSelectElement>) => {
//                 const selectedValue = e.target.value;
//                 console.log("Selected sickle cell value:", selectedValue);
//                 setSicklecell(selectedValue);
//             },
//         }
//     ];
//     if (values.sicklecell == "Yes") {
//         formFields.push({
//             label: `Sickle Cell Report`,
//             value: values.sicklereport,
//             name: "sicklereport",
//             type: "select",
//             placeholder: `Select Report Type`,
//             options: [
//                 { label: "AS", value: "AS" },
//                 { label: "SS", value: "SS" },
//             ],
//         });
//     }

//     return (
//         <>
//             {sicklecell}
//             <Button
//                 variant="primary"
//                 onClick={() => {

//                     setShowModel(true)
//                 }}
//                 className="btn btn-sm"
//             >
//                 {values.updateTownId ?
//                     <KTIcon iconName={"pencil"} className="fs-6" iconType="solid" />
//                     : <KTIcon
//                         iconName={"plus-circle"}
//                         className="fs-3"
//                         iconType="solid"
//                     />

//                 }

//                 {values.updateTownId ? t("edit") : t("submit")}
//             </Button>

//             <ComponentFile
//                 size="lg"
//                 show={showmodel}
//                 handleClose={() => setShowModel(false)}
//                 handleSubmit={handleSubmit}
//                 title={values.updateTownId ? t("updatepage") : t("insertpage")}
//                 formData={{
//                     fields: formFields,
//                     error: "",
//                 }}
//                 submitButtonLabel={
//                     values.updateTownId
//                         ? isLoading
//                             ? "Submitting..."
//                             : t("editsubmit")
//                         : isLoading
//                             ? "Submitting..."
//                             : t("submit")
//                 }
//                 disabledButton={isLoading}
//             />
//         </>



//     )
// }

// export default StudentAddData