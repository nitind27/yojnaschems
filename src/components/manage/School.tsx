"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { clusterdata, Schooldata, talukasdata } from "../type";
import { toast } from "react-toastify";
import { validateSchoolForm } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { createConfirmation } from "react-confirm";
import Image from "next/image";
type Props = {
  initialschoolData: Schooldata[];
  clusterdata: clusterdata[];
  talukas: talukasdata[];
};

const School = ({ initialschoolData, clusterdata, talukas }: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [schoolId, setSchoolId] = useState<number | string>("");
  const [schoolName, setSchoolName] = useState("");
  const [address, setAddress] = useState("");
  const [clusterId, setClusterId] = useState<number | string>("");
  const [talukaId, setTalukaId] = useState<number | string>("");
  const [udias, setUdias] = useState("");
  const [stds, setStds] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [medium, setMedium] = useState("");
  const [emailId, setEmailId] = useState("");
  const [mukhyaName, setMukhyaName] = useState("");
  const [mukhyaContact, setMukhyaContact] = useState("");
  const [mukhyaEmail, setMukhyaEmail] = useState("");
  const [purushName, setPurushName] = useState("");
  const [purushContact, setPurushContact] = useState("");
  const [purushEmail, setPurushEmail] = useState("");
  const [striName, setStriName] = useState("");
  const [striContact, setStriContact] = useState("");
  const [striEmail, setStriEmail] = useState("");
  const [schoolNameMr, setSchoolNameMr] = useState("");
  const [imageUrls, setImageUrls] = useState("");
  const [error, setError] = useState<string>("");
  const [updateTownId, setUpdateTownId] = useState<number | null>(null);
  const [schooldata, setSchooldata] = useState<Schooldata[]>(initialschoolData);
  const t = useTranslations("School");
  const confirm = createConfirmation(ConfirmationDialog);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const clusterMap = clusterdata.reduce((acc, cluster: clusterdata) => {
    acc[cluster.cluster_id] = cluster.cluster_name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);

  const talukaMap = talukas.reduce((acc, taluka: any) => {
    acc[taluka.id] = taluka.name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);

  const data = schooldata
    .map((school) => ({
      school_id: school.school_id,
      school_name: school.school_name,
      address: school.address,
      c_id: school.cluster_id,
      t_id: school.taluka_id,
      cluster_id: clusterMap[school.cluster_id],
      taluka_id: talukaMap[school.taluka_id],
      udias: school.udias,
      stds: school.stds,
      medium: school.school_name,
      email_id: school.email_id,
      mukhya_name: school.mukhya_name,
      mukhya_contact: school.mukhya_contact,
      mukhya_email: school.mukhya_email,
      purush_name: school.purush_name,
      purush_contact: school.purush_contact,
      purush_email: school.purush_email,
      stri_name: school.stri_name,
      stri_email: school.stri_email,
      stri_contact: school.stri_contact,
      school_name_mr: school.school_name_mr,
      // status: school.status,
      image_urls: school.image_urls,
    }))
    .reverse();

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
      accessorKey: "school_name",
      header: `${t("schoolname")}`,
    },
    {
      accessorKey: "address",
      header: `${t("address")}`,
    },
    {
      accessorKey: "cluster_id",
      header: `${t("clustername")}`,
    },
    {
      accessorKey: "taluka_id",
      header: `${t("taluksname")}`,
    },
    {
      accessorKey: "stds",
      header: `${t("division")}`,
    },
    {
      accessorKey: "medium",
      header: `${t("medium")}`,
    },
    {
      accessorKey: "udias",
      header: `${t("udiasno")}`,
    },

    {
      accessorKey: "email_id",
      header: `${t("schoolemail")}`,
    },
    {
      accessorKey: "mukhya_name",
      header: `${t("mukhyaname")}`,
    },
    {
      accessorKey: "mukhya_contact",
      header: `${t("mukhyacontact")}`,
    },
    {
      accessorKey: "mukhya_email",
      header: `${t("mukhyaemail")}`,
    },
    {
      accessorKey: "purush_name",
      header: `${t("purushname")}`,
    },
    {
      accessorKey: "purush_contact",
      header: `${t("purushmobile")}`,
    },
    {
      accessorKey: "purush_email",
      header: `${t("purushemail")}`,
    },
    {
      accessorKey: "stri_name",
      header: `${t("striname")}`,
    },
    {
      accessorKey: "stri_contact",
      header: `${t("stricontact")}`,
    },
    {
      accessorKey: "stri_email",
      header: `${t("striemail")}`,
    },

    {
      accessorKey: "school_name_mr",
      header: `${t("enterschoolname")}`,
    },
    // {
    //   accessorKey: "status",
    //   header: `${t('SrNo')}`,
    // },


    {
      accessorKey: "image_urls",
      header: `${t("image_urls")}`,
      cell: ({ row }: any) => {
        const photoSrc = row.original.image_urls.startsWith("/")
          ? row.original.image_urls
          : `/${row.original.image_urls}`;
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
      accessorKey: "actions",
      header: `${t("Action")}`,
      cell: ({ row }: any) => (
        <div style={{ display: "flex", whiteSpace: "nowrap" }}>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEdit(row.original)}
          >
            <KTIcon iconName={"pencil"} className="fs-6" iconType="solid" />
            {t("edit")}
          </button>
          <button
            className={`btn btn-sm ${row.original.status === "Active" ? "btn-danger" : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.school_id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === "Active"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
          <button
            className="btn btn-sm btn-primary ms-5"
            onClick={() => handleImageClick(row.original.school_id)}
          >
            Upload Image
          </button>
        </div>
      ),
    },
  ];

  const handleImageClick = (schoolId: number) => {
    // Open file input to select image
    setSchoolId(schoolId);
    document.getElementById("fileInput")?.click();
  };

  const handleFileChange = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (file && schoolId) {
      setSelectedFile(file);
      await uploadImage(schoolId as any, file);
    }
  };

  const uploadImage = async (schoolId: number, file: File) => {
    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await fetch(`/api/school/upload/${schoolId}`, {
        method: "POST",
        body: formData,
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Image uploaded successfully!");

        // Update the school data with the new image URL
        const updatedData = schooldata.map((school) =>
          school.school_id === schoolId
            ? { ...school, image_urls: data.image_urls }
            : school
        );
        setSchooldata(updatedData);
      } else {
        toast.error(data.error || "Failed to upload image.");
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Error uploading image.");
    }
  };

  const handleDeactivate = async (
    school_id: number | string,
    currentStatus: string
  ) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this School?"
        : "Are you sure you want to activate this School?";
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const newStatus = currentStatus === "Active" ? "Deactive" : "Active";

        const response = await fetch(`/api/school/delete/${school_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          setSchooldata((prevData) =>
            prevData.map((school) =>
              school.school_id === school_id
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
    setSchoolId("");
    setSchoolName("");
    setAddress("");
    setClusterId("");
    setTalukaId("");
    setUdias("");
    setStds("");
    setMedium("");
    setEmailId("");
    setMukhyaName("");
    setMukhyaContact("");
    setMukhyaEmail("");
    setPurushName("");
    setPurushContact("");
    setPurushEmail("");
    setStriName("");
    setStriContact("");
    setStriEmail("");
    setSchoolNameMr("");
    setImageUrls("");
    setError("");
    setUpdateTownId(null);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // const errors = validateSchoolForm({
    //   schoolName,
    //   address,
    //   clusterId: String(clusterId), // Convert to string
    //   talukaId: String(talukaId),
    //   udias,
    //   stds,
    //   medium,
    //   emailId,
    //   mukhyaName,
    //   mukhyaContact,
    //   mukhyaEmail,
    //   purushName,
    //   purushContact,
    //   purushEmail,
    //   striName,
    //   striContact,
    //   striEmail,
    //   schoolNameMr,
    // });
    // // If there are error messages, set them and prevent submission
    // if (errors.length > 0) {
    //   setError(errors.join("<br />"));
    //   return;
    // }
    setIsLoading(true); // Start loading

    try {
      const method = updateTownId ? "PUT" : "POST";
      const url = updateTownId ? `/api/school/update` : `/api/school/insert`;

      const bodyData = {
        school_id: updateTownId ? updateTownId.toString() : undefined, // School ID if updating
        school_name: schoolName,
        address: address,
        cluster_id: clusterId,
        taluka_id: talukaId,
        udias: udias,
        stds: stds,
        medium: medium,
        email_id: emailId,
        mukhya_name: mukhyaName,
        mukhya_contact: mukhyaContact,
        mukhya_email: mukhyaEmail,
        purush_name: purushName,
        purush_contact: purushContact,
        purush_email: purushEmail,
        stri_name: striName,
        stri_email: striEmail,
        stri_contact: striContact,
        school_name_mr: schoolNameMr, // Marathi name of the school
        image_urls: imageUrls, // Image URLs if any
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        toast.success(
          `School ${updateTownId ? "updated" : "inserted"} successfully!`
        );

        // Update local state without page reload
        if (!updateTownId) {
          // If inserting a new entry
          const newSchool = await response.json();
          setSchooldata((prevData) => [...prevData, newSchool]);
        } else {
          // If updating an existing entry
          setSchooldata((prevData: any) =>
            prevData.map((school: any) =>
              school.school_id === updateTownId
                ? { ...school, ...bodyData }
                : school
            )
          );
        }

        handleClosePrint(); // Close the modal or reset form after submission
      } else {
        const data = await response.json();

        toast.error(
          `Failed to ${updateTownId ? "update" : "insert"} School: ${data.error
          }`
        );
      }
    } catch (error) {
      console.error("Error during operation:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = (school: any) => {
    setUpdateTownId(school.school_id); // Set the ID of the school being edited
    setSchoolName(school.school_name); // Set the name of the school
    setAddress(school.address); // Set the address
    setClusterId(school.c_id); // Set the Cluster ID
    setTalukaId(school.t_id); // Set the Taluka ID
    setUdias(school.udias); // Set the UDIAS value
    setStds(school.stds); // Set the STDS value
    setMedium(school.medium); // Set the Medium
    setEmailId(school.email_id); // Set the email ID
    setMukhyaName(school.mukhya_name); // Set the Mukhya Name
    setMukhyaContact(school.mukhya_contact); // Set the Mukhya Contact
    setMukhyaEmail(school.mukhya_email); // Set the Mukhya Email
    setPurushName(school.purush_name); // Set the Purush Name
    setPurushContact(school.purush_contact); // Set the Purush Contact
    setPurushEmail(school.purush_email); // Set the Purush Email~
    setStriName(school.stri_name); // Set the Stri Name
    setStriContact(school.stri_contact); // Set the Stri Contact
    setStriEmail(school.stri_email);
    setSchoolNameMr(school.school_name_mr); // Set the school name in Marathi

    handleShowPrint(); // Show the modal for editing
  };
  const handleimage = (school: any) => {
    alert(school.school_id);
  };
  return (
    <div>
      <Table
        data={data}
        columns={columns}
        Button={
          <Button
            variant="primary"
            onClick={() => {
              resetForm(); // Reset for new entry
              handleShowPrint();
            }}
            className="btn btn-sm"
          >
            <KTIcon
              iconName={"plus-circle"}
              className="fs-3"
              iconType="solid"
            />
            {t("addschool")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={updateTownId ? `${t("insertpage")}` : `${t("insertpage")}`}
        formData={{
          fields: [
            {
              label: `${t("enterschoolname")}`,
              required: true,
              value: schoolName,
              type: "text",
              placeholder: `${t("enterschoolname")}`,
              onChange: (e: any) => setSchoolName(e.target.value),
            },
            {
              label: `${t("enterschooladdress")}`,
              value: address,
              type: "text",
              required: true,
              placeholder: `${t("enterschooladdress")}`,
              onChange: (e: any) => setAddress(e.target.value),
            },

            {
              label: `${t("clustername")}`,
              value: clusterId || "", // Default value when updating
              onChange: (e: any) => setClusterId(e.target.value),
              type: "select",
              options: clusterdata.map((cluster: clusterdata) => ({
                value: cluster.cluster_id,
                label: cluster.cluster_name,
              })),
              placeholder: `${t("clustername")}`, // Optional placeholder for select input
            },
            {
              label: `${t("selecttaluka")}`,
              value: talukaId || "", // Default value when updating
              onChange: (e: any) => setTalukaId(e.target.value),
              type: "select",
              options: talukas.map((taluka: any) => ({
                value: taluka.id,
                label: taluka.name,
              })),
              placeholder: `${t("selecttaluka")}`, // Optional placeholder for select input
            },
            {
              label: `${t("enterudiasno")}`,
              value: udias,
              required: true,
              type: "text",
              placeholder: `${t("enterudiasno")}`,
              onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 11) {
                  setUdias(inputValue);
                }
              },
            },

            {
              label: `${t("enterdivision")}`,
              value: stds,
              required: true,
              type: "text",
              placeholder: `${t("enterdivision")}`,
              onChange: (e: any) => setStds(e.target.value),
            },

            {
              label: `${t("entermedium")}`,
              value: medium || "", // Default value when updating
              onChange: (e: any) => setMedium(e.target.value),
              type: "select",

              options: [
                {
                  label: "Semi English /Marathi",
                  value: "Semi English /Marathi",
                },
                { label: "Semi English", value: "Semi English" },
                { label: "Marathi", value: "Marathi" },
              ],
              placeholder: `${t("entermedium")}`, // Optional placeholder for select input
            },

            {
              label: `${t("schoolemail")}`,
              value: emailId,
              type: "email",
              required: true,
              placeholder: `${t("schoolemail")}`,
              onChange: (e: any) => setEmailId(e.target.value),
            },
            {
              label: `${t("entermukhyaname")}`,
              value: mukhyaName,
              required: true,
              type: "text",
              placeholder: `${t("entermukhyaname")}`,
              onChange: (e: any) => setMukhyaName(e.target.value),
            },
            {
              label: `${t("entermukhyacontact")}`,
              value: mukhyaContact,
              type: "text",
              required: true,
              placeholder: `${t("entermukhyacontact")}`,

              onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                  setMukhyaContact(inputValue);
                }
              },
            },
            {
              label: `${t("entermukhyaemail")}`,
              value: mukhyaEmail,
              type: "email",
              required: true,
              placeholder: `${t("entermukhyaemail")}`,
              onChange: (e: any) => setMukhyaEmail(e.target.value),
            },
            {
              label: `${t("enterpurushname")}`,
              value: purushName,
              type: "text",
              required: true,
              placeholder: `${t("enterpurushname")}`,
              onChange: (e: any) => setPurushName(e.target.value),
            },
            {
              label: `${t("enterpurushcontact")}`,
              value: purushContact,
              type: "text",
              placeholder: `${t("enterpurushcontact")}`,

              onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                  setPurushContact(inputValue);
                }
              },
            },
            {
              label: `${t("enterpurushemail")}`,
              value: purushEmail,
              type: "email",
              required: true,
              placeholder: `${t("enterpurushemail")}`,
              onChange: (e: any) => setPurushEmail(e.target.value),
            },
            {
              label: `${t("enterstriname")}`,
              value: striName,
              type: "text",
              required: true,
              placeholder: `${t("enterstriname")}`,
              onChange: (e: any) => setStriName(e.target.value),
            },
            {
              label: `${t("enterstricontact")}`,
              value: striContact,
              required: true,
              type: "text",
              placeholder: `${t("enterstricontact")}`,

              onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                  setStriContact(inputValue);
                }
              },
            },
            {
              label: `${t("enterstreeemail")}`,
              value: striEmail,
              type: "email",
              required: true,
              placeholder: `${t("enterstreeemail")}`,
              onChange: (e: any) => setStriEmail(e.target.value),
            },
          ],
          error,
        }}
        submitButtonLabel={
          updateTownId
            ? isLoading
              ? "Submitting..."
              : t("editsubmit")
            : isLoading
              ? "Submitting..."
              : t("submit")
        }
        disabledButton={isLoading}
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

export default School;
