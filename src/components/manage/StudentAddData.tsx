import React, { useState } from "react";
import { toast } from "react-toastify";
import { Button } from "react-bootstrap";
import { useTranslations } from "next-intl";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { Schooldata, Standarddata } from "../type";

const StudentAddData = ({
  values,
  schooldata,
  standarddata,
  setStudentData,
}: {
  values: any;
  schooldata: Schooldata[];
  standarddata: Standarddata[];
  setStudentData: React.Dispatch<React.SetStateAction<any[]>>;
}) => {
  const t = useTranslations("student");

  const [showModel, setShowModel] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [updateTownId, setUpdateTownId] = useState<number | null>(null);
  const [formState, setFormState] = useState({
    serialnumber: "",
    studentName: "",
    grno: "",
    saralid: "",
    schoolname: "",
    standard: "",
    mothername: "",
    dob: "",
    gender: "",
    cast: "",
    aadhaar: "",
    contactNo: "",
    address: "",
    sicklecell: "",
    sicklereport: "",
  });
  console.log("fasdfaeee", schooldata);
  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormState((prevState) => ({ ...prevState, [name]: value }));
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    const dob = new Date(formState.dob);

    const bodyData = {
      student_id: values.studentId || undefined,
      serial_number: formState.serialnumber,
      full_name: formState.studentName,
      gr_no: formState.grno,
      uid: formState.saralid,
      school_id: formState.schoolname,
      current_std: formState.standard,
      mother_name: formState.mothername,
      date_of_birth: dob,
      gender: formState.gender,
      cast: formState.cast,
      aadhaar: formState.aadhaar,
      contact_no: formState.contactNo,
      address: formState.address,
      sickle_cell: formState.sicklecell,
      sickle_report:
        formState.sicklecell === "Yes" ? formState.sicklereport : "",
    };

    try {
      const method = values.updateTownId ? "PUT" : "POST";
      const url = values.updateTownId
        ? `/api/student/update`
        : `/api/student/insert`;

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        const message = values.updateTownId ? "updated" : "added";
        toast.success(`Student ${message} successfully!`);

        const updatedStudent = await response.json();
        if (values.studentId) {
          setStudentData((prevData) =>
            prevData.map((student) =>
              student.student_id === values.studentId
                ? { ...student, ...updatedStudent }
                : student
            )
          );
        } else {
          setStudentData((prevData) => [...prevData, updatedStudent]);
        }

        setShowModel(false);
      } else {
        const error = await response.json();
        toast.error(`Failed to save student: ${error.message}`);
      }
    } catch (error) {
      console.error("Submission error:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const formFields = [
    {
      label: t("serialnumber"),
      name: "serialnumber",
      type: "text",
      placeholder: t("serialnumber"),
      value: formState.serialnumber,
      onChange: (e: any) =>
        setFormState({ ...formState, serialnumber: e.target.value }),
    },
    {
      label: t("studentName"),
      name: "studentName",
      type: "text",
      placeholder: t("studentName"),
      value: formState.studentName,
      onChange: (e: any) =>
        setFormState({ ...formState, studentName: e.target.value }),
    },
    {
      label: t("grno"),
      name: "grno",
      type: "text",
      placeholder: t("grno"),
      value: formState.grno,

      onChange: (e: any) =>
        setFormState({ ...formState, grno: e.target.value }),
    },
    {
      label: t("saralid"),
      name: "saralid",
      type: "text",
      placeholder: t("saralid"),
      value: formState.saralid,
      onChange: (e: any) =>
        setFormState({ ...formState, saralid: e.target.value }),
    },
    {
      label: t("Schoolname"),
      name: "schoolname",
      type: "select",
      placeholder: t("Schoolname"),
      value: formState.schoolname,
      options: schooldata.map((student) => ({
        value: student.school_id,
        label: student.school_name,
      })),
      onChange: (e: any) =>
        setFormState({ ...formState, schoolname: e.target.value }),
    },
    {
      label: t("std"),
      name: "standard",
      type: "select",
      placeholder: t("std"),
      value: formState.standard,
      options: standarddata.map((std) => ({
        value: std.standard_id,
        label: std.standard_name,
      })),
      onChange: (e: any) =>
        setFormState({ ...formState, standard: e.target.value }),
    },
    {
      label: t("Monthername"),
      name: "mothername",
      type: "text",
      placeholder: t("Monthername"),
      value: formState.mothername,
      onChange: (e: any) =>
        setFormState({ ...formState, mothername: e.target.value }),
    },
    {
      label: t("dob"),
      name: "dob",
      type: "date",
      placeholder: t("dob"),
      value: formState.dob,
      onChange: (e: any) => setFormState({ ...formState, dob: e.target.value }),
    },
    {
      label: t("gender"),
      name: "gender",
      type: "select",
      placeholder: t("gender"),
      value: formState.gender,
      options: [
        { label: "Male", value: "Male" },
        { label: "Female", value: "Female" },
        { label: "Other", value: "Other" },
      ],
      onChange: (e: any) =>
        setFormState({ ...formState, gender: e.target.value }),
    },
    {
      label: t("cast"),
      name: "cast",
      type: "select",
      placeholder: t("cast"),
      value: formState.cast,
      options: [
        { label: "SC", value: "SC" },
        { label: "ST", value: "ST" },
        { label: "OBC", value: "OBC" },
        { label: "SBC", value: "SBC" },
        { label: "NT B", value: "NT B" },
        { label: "General", value: "General" },
      ],
      onChange: (e: any) =>
        setFormState({ ...formState, cast: e.target.value }),
    },
    {
      label: t("aadharcard"),
      name: "aadhaar",
      type: "text",
      placeholder: "eg. 121212121212",
      value: formState.aadhaar,
      onChange: (e: any) => {
        const value = e.target.value;
        // Allow only numeric input and limit to 10 digits
        if (/^\d{0,12}$/.test(value)) {
          setFormState({ ...formState, aadhaar: value });
        }
      },
    },
    {
      label: t("Contact"),
      name: "contactNo",
      type: "text",
      placeholder: "eg.7359595959",
      value: formState.contactNo,
      onChange: (e: any) => {
        const value = e.target.value;
        // Allow only numeric input and limit to 10 digits
        if (/^\d{0,10}$/.test(value)) {
          setFormState({ ...formState, contactNo: value });
        }
      },
    },
    {
      label: t("address"),
      name: "address",
      type: "text",
      placeholder: t("address"),
      value: formState.address,
      onChange: (e: any) =>
        setFormState({ ...formState, address: e.target.value }),

      
    },


  
    

    {
      label: t("sicklecell"),
      name: "sicklecell",
      type: "select",
      placeholder: t("sicklecell"),
      value: formState.sicklecell,
      options: [
        { label: "Yes", value: "Yes" },
        { label: "No", value: "No" },
      ],
      onChange: (e: any) =>
        setFormState({ ...formState, sicklecell: e.target.value }),
    },
  ];

  if (formState.sicklecell === "Yes") {
    formFields.push({
      label: `Sickle Cell Report`,
      name: "sicklereport",
      type: "select",
      placeholder: `Select Report Type`,
      value: formState.sicklereport,
      options: [
        { label: "AS", value: "AS" },
        { label: "SS", value: "SS" },
      ],
      onChange: (e: any) =>
        setFormState({ ...formState, sicklereport: e.target.value }),
    });
  }

  const handleEdit = (school: any) => {
  
    setFormState({
      serialnumber: school.serialnumber || formState.serialnumber,
      studentName: school.studentName || formState.studentName,
      grno: school.grno || formState.grno,
      saralid: school.saralid || formState.saralid,
      schoolname: school.schoolname || formState.schoolname, // Set the name of the school
      standard: school.standard || formState.standard,
      mothername: school.mothername || formState.mothername,
      dob: school.dob || formState.dob,
      gender: school.gender || formState.gender,
      cast: school.cast || formState.cast,
      aadhaar: school.aadhaar || formState.aadhaar,
      contactNo: school.contactNo || formState.contactNo,
      address: school.address, // Set the address
      sicklecell: school.sicklecell || formState.sicklecell,
      sicklereport: school.sicklereport || formState.sicklereport,
    });
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => {
          setShowModel(true); // Show the modal
          handleEdit(values);
        }}
        className="btn btn-sm"
      >
        {values.updateTownId ? (
          <KTIcon iconName={"pencil"} className="fs-6" iconType="solid" />
        ) : (
          <KTIcon iconName={"plus-circle"} className="fs-3" iconType="solid" />
        )}
        {values.updateTownId ? t("edit") : t("submit")}
      
      </Button>

      <CustomModal
        size="lg"
        show={showModel}
        handleClose={() => setShowModel(false)}
        handleSubmit={handleSubmit}
        title={values.updateTownId ? t("updatepage") : t("insertpage")}
        formData={{ fields: formFields, error: "" }}
        submitButtonLabel={
          values.updateTownId
            ? isLoading
              ? "Submitting..."
              : t("editsubmit")
            : isLoading
            ? "Submitting..."
            : t("submit")
        }
        disabledButton={isLoading}
      />
    </>
  );
};

export default StudentAddData;
