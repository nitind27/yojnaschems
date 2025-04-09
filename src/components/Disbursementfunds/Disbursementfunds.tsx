"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { clusterdata, grampanchayat, NidhiVitaran, Representative, talukasdata, Villages, WorkMaster, WorkMasterDemo } from "../type";
import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";

import { useTranslations } from "next-intl";
import { useLocation } from "@/common/LocationComponent";
import Image from "next/image";
import Link from "next/link";

type Props = {
  initialdisbursementfunds: NidhiVitaran[];
  workmaster: WorkMaster[];
  reprenstive: Representative[];
  Workmasters: WorkMasterDemo[];
  talukas: talukasdata[];
  grampanchayat: grampanchayat[];
  Villages: Villages[];
  workmasterdemo: WorkMasterDemo[];
};

const Disbursementfunds = ({ initialdisbursementfunds, workmaster, workmasterdemo, reprenstive, Workmasters, talukas, grampanchayat, Villages }: Props) => {
  const t = useTranslations("Disbursementfunds");
  const { latitude, longitude } = useLocation();
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [requirementid, setrequirementid] = useState("");
  const [selectwork, setSelectwork] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [vitrandate, setVitrandate] = useState("");
  const [Installment, setInstallment] = useState("");
  const [percentage, setpercentage] = useState("");
  const [Amount, setAmount] = useState(percentage);
  const [Latitude, setLatitude] = useState(latitude);
  const [Longitude, setLongitude] = useState(longitude);
  const [Adress, setAdress] = useState("");
  const [error, setError] = useState<string>("");
  const [updateClusterId, setUpdateClusterId] = useState<bigint | null>(null);
  const [clusterData, setClusterData] = useState<NidhiVitaran[]>(
    initialdisbursementfunds
  ); // State for cluster data
  const [insertImage, setInsertImage] = React.useState<File | null>(null); // File object for the selected image

  const [imagePreview, setImagePreview] = React.useState<string>(""); // URL for image preview
  const [isResponsive, setIsResponsive] = useState<boolean>(false);

  useEffect(() => {
    const handleResize = () => {
      setIsResponsive(window.innerWidth < 768); // Adjust threshold as needed
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Check on mount

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);
  const workid = workmasterdemo.reduce((acc, work: any) => {
    acc[work.id] = work.name; // Convert bigint to string
    return acc;
  }, {} as Record<string, string>); // Change Record<number, string> to Record<string, string>
  const gpmap = grampanchayat.reduce((acc, gp: any) => {
    acc[gp.id] = gp.name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);
  const village = Villages.reduce((acc, gp: Villages) => {
    acc[gp.id] = gp.name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);


  const talukaMap = talukas.reduce((acc, taluka: any) => {
    acc[taluka.id] = taluka.name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);

  const reprenstives = reprenstive.reduce((acc, year: Representative) => {
    acc[year.id as any] = year.name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);
  const data = clusterData
    .map((NidhiVitaran) => ({
      id: NidhiVitaran.id,
      work_master_id: workid[NidhiVitaran.work_master_id as any],
      work_id: NidhiVitaran.work_master_id,
      date:
        NidhiVitaran.date && typeof NidhiVitaran.date === "string"
          ? formatDate(NidhiVitaran.date)
          : NidhiVitaran.date instanceof Date
            ? formatDate(NidhiVitaran.date.toISOString())
            : "Invalid date",
      installment: NidhiVitaran.installment,
      amount: NidhiVitaran.amount,
      requirement_id: reprenstives[NidhiVitaran.requirement_id],
      requirementid: NidhiVitaran.requirement_id,
      photo: NidhiVitaran.photo,
      latitude: NidhiVitaran.latitude + " " + NidhiVitaran.longitude,
      address: NidhiVitaran.address,
      status: NidhiVitaran.status,
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
      accessorKey: "requirement_id",
      header: `${t("representativeid")}`,
    },
    {
      accessorKey: "work_master_id",
      header: `${t("work")}`,
    },
    {
      accessorKey: "date",
      header: `${t("VitranDate")}`,
    },
    {
      accessorKey: "installment",
      header: `${t("Installment")}`,
    },
    {
      accessorKey: "amount",
      header: `${t("amount")}`,
    },
    // {
    //   accessorKey: "photo",
    //   header: `${t('attechments')}`,
    // },

    {
      accessorKey: "latitude",
      header: `${t("latlong")}`,
    },

    {
      accessorKey: "address",
      header: `${t("address")}`,
    },

    {
      accessorKey: "photo",
      header: `${t("attechments")}`,
      cell: ({ row }: any) => {
        const photoSrc = row.original.photo.startsWith("/")
          ? row.original.photo
          : `/${row.original.photo}`;
        return (
          <div style={{ textAlign: "center" }}>
            <Image
              src={photoSrc}
              alt={t("image")}
              style={{ objectFit: "cover" }}
              height={100} // Adjust size as needed
              width={100}
            />
            <br />
            <Link href={photoSrc} target="_blank" rel="noopener noreferrer">
              view
            </Link>
          </div>
        );
      },
    },
    {
      accessorKey: "status",
      header: `${t("status")}`,
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
              handleDeactivate(row.original.id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === "Active"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
        </div>
      ),
    },
  ];

  const handleDeactivate = async (id: any, currentStatus: any) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this Disbursementfundes?"
        : "Are you sure you want to activate this Disbursementfundes?";

    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`/api/disbursementfunds/delete/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: currentStatus === "Active" ? "Deactive" : "Active",
          }),
        });

        if (response.ok) {
          // Update local state without page reload
          setClusterData((prevData) =>
            prevData.map((cluster) =>
              cluster.id === id
                ? {
                  ...cluster,
                  status: currentStatus === "Active" ? "Deactive" : "Active",
                }
                : cluster
            )
          );
          toast.success(
            `Disbursementfundes ${currentStatus === "Active" ? "deactivated" : "activated"
            } successfully!`
          );
        } else {
          toast.error("Failed to change the cluster status.");
        }
      } catch (error) {
        console.error("Error changing the cluster status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const resetForm = () => {
    setSelectwork("");
    setVitrandate("");
    setInstallment("");
    setAmount("");
    setAdress("");
    setpercentage("");
    setImagePreview("");
    setAdress("");
    setAdress("");
    setUpdateClusterId(null);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // Create FormData to handle both file and form data
    const formData = new FormData();
    formData.append("requirement_id", requirementid);
    formData.append("work_master_id", selectwork);
    formData.append("date", vitrandate);
    formData.append("installment", Installment);
    formData.append("amount", percentage);
    formData.append("latitude", latitude !== null ? latitude.toString() : "");
    formData.append(
      "longitude",
      longitude !== null ? longitude.toString() : ""
    );
    formData.append("address", Adress);
    console.log("fsdfaaf", insertImage);
    // Add the image file to the form data if there's an image to upload
    if (insertImage) {
      formData.append("photo", insertImage);
    }
    setIsLoading(true); // Start loading

    try {
      // Determine if this is an insert or update operation
      const method = updateClusterId ? "PATCH" : "POST";
      const url = updateClusterId
        ? `/api/disbursementfunds/update` // If updating, call the update endpoint
        : `/api/disbursementfunds/insert`; // If inserting, call the insert endpoint

      // If updating, include the cluster ID
      if (updateClusterId) {
        formData.append("id", updateClusterId.toString());
      }

      // Send the form data to the backend
      const response = await fetch(url, {
        method,
        body: formData, // Use FormData instead of JSON string
      });

      if (response.ok) {
        const createdData = await response.json();

        if (!updateClusterId) {
          // If inserting a new entry, update the state with the new data
          setClusterData((prevData) => [...prevData, createdData]);
          toast.success("Disbursementfundes inserted successfully!");
        } else {
          // If updating an existing entry, update the specific item in the state
          setClusterData((prevData) =>
            prevData.map((cluster) =>
              cluster.id === updateClusterId
                ? { ...cluster, ...createdData }
                : cluster
            )
          );
          toast.success("Disbursementfundes updated successfully!");
        }

        // Reset form and close modal after successful submission
        resetForm();
        handleClosePrint();
      } else {
        // Handle errors from the server
        toast.error(
          `Failed to ${updateClusterId ? "update" : "insert"} cluster.`
        );
      }
    } catch (error) {
      console.error("Error during operation:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleImageChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const file = (e.target as HTMLInputElement).files?.[0]; // Type assertion to HTMLInputElement
    if (file) {
      setInsertImage(file); // Store the actual file object
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };
  const handleEdit = (NidhiVitaran: any) => {
    setUpdateClusterId(NidhiVitaran.id);
    setSelectwork(NidhiVitaran.work_id.toString());
    setVitrandate(NidhiVitaran.date);
    setrequirementid(NidhiVitaran.requirementid);
    setInstallment(NidhiVitaran.installment);
    setAdress(NidhiVitaran.address);
    setAmount(NidhiVitaran.amount);
    setpercentage(NidhiVitaran.amount)
    setImagePreview(NidhiVitaran.photo);

    handleShowPrint(); // Show the modal for editing
  };

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    // setClusterName("");
    resetForm();
    setError("");
    setUpdateClusterId(null); // Reset update ID when closing
  };

  return (
    <div>

      <Table
        data={data}
        columns={columns}
        Button={
          <Button
            variant="primary"
            onClick={handleShowPrint}
            className="btn btn-sm"
          >
            <KTIcon
              iconName={"plus-circle"}
              className="fs-3"
              iconType="solid"
            />
            {t("addDisbursement")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        size="lg"
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={updateClusterId ? `${t("updatepage")}` : `${t("insertpage")}`}
        imagepriview={
          imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{
                width: "150px", 
                height: "150px",  
                borderRadius: "5%", 
                objectFit: "cover",  
                overflow: "hidden",  
              }}
            />
          )
        }
        formData={{
          fields: [
            {
              label: `${t("representativeid")}`,
              value: requirementid,
              onChange: (e: any) => setrequirementid(e.target.value),
              type: "select",
              className: isResponsive ? 'col-12' : 'col-4',
              options: reprenstive.map((category: Representative) => ({
                value: category.id,
                label: category.name,
              })),
              placeholder: `${t("representativeid")}`, // Optional placeholder for select input
            },
            {
              label: `${t('enterwork')}`,
              value: selectwork,
              onChange: (e: any) => setSelectwork(e.target.value),
              type: "select",
              className: isResponsive ? 'col-12' : 'col-8',
              options: Workmasters
                .filter((type) =>
                  String(type.representative_id) as any == requirementid
                )
                .map((yojna) => ({
                  value: yojna.id,
                  label: yojna.name,
                })),
              placeholder: `${t("enterwork")}`, // Optional placeholder for select input
            },
            {
              label: `${t("dist")}`,
              value: selectwork,
              disabled: true,
              className: isResponsive ? 'col-12' : 'col-4',
              onChange: (e: any) => setSelectwork(e.target.value),
              type: "select",

              options: Workmasters
                .filter((type) =>
                  String(type.representative_id) as any == requirementid && String(type.id) == selectwork
                )
                .map((yojna) => ({
                  value: yojna.id,
                  label: talukaMap[yojna.taluka_id as any],
                })),
              placeholder: `${t("dist")}`, // Optional placeholder for select input
            },
            {
              label: `${t("grampanchayatname")}`,
              value: selectwork,
              disabled: true,
              className: isResponsive ? 'col-12' : 'col-4',
              onChange: (e: any) => setSelectwork(e.target.value),
              type: "select",

              options: Workmasters
                .filter((type) =>
                  String(type.representative_id) as any == requirementid && String(type.id) == selectwork
                )
                .map((yojna) => ({
                  value: yojna.id,
                  label: gpmap[yojna.gp_id as any],
                })),
              placeholder: `${t("grampanchayatname")}`, // Optional placeholder for select input
            },
            {
              label: `${t("Village")}`,
              value: selectwork,
              disabled: true,
              className: isResponsive ? 'col-12' : 'col-4',
              onChange: (e: any) => setSelectwork(e.target.value),
              type: "select",

              options: Workmasters
                .filter((type) =>
                  String(type.representative_id) as any == requirementid && String(type.id) == selectwork
                )
                .map((yojna) => ({
                  value: yojna.id,
                  label: village[yojna.village_id as any],
                })),
              placeholder: `${t("Village")}`, // Optional placeholder for select input
            },
            {
              label: `${t("estimateamounttotal")}`,
              value: Workmasters
                .filter((type) =>
                  String(type.representative_id) as any == requirementid && String(type.id) == selectwork
                )
                .map((yojna) => (
                  yojna.estimated_amount

                )),
              className: isResponsive ? 'col-12' : 'col-4',
              disabled: true,
              required: true,
              type: "text",
              placeholder: `${t("estimateamounttotal")}`,
              onChange: (e: any) => setAmount(e.target.value),
            },
            //         ins_date_time:
            // //     typeof cluster.ins_date_time === "string"
            // //       ? formatDate(cluster.ins_date_time)
            // //       : formatDate(cluster.ins_date_time.toISOString()),
            // // }))
            {
              label: `${t("date")}`,
              disabled: true,
              value: Workmasters
                .filter((type) =>
                  String(type.representative_id) as any == requirementid && String(type.id) == selectwork
                )
                .map((yojna: any) => {
                  const generatedWorkDate = yojna.genratedworkdate;
                  return generatedWorkDate
                    && formatDate(generatedWorkDate as any)

                }),
              required: true,
              className: isResponsive ? 'col-12' : 'col-4',
              type: 'text',
              placeholder: `${t('date')}`,
              onChange: (e: any) => setVitrandate(e.target.value),
            },
            {
              label: `${t("vitrandate")}`,
              value: vitrandate,
              required: true,
              className: isResponsive ? 'col-12' : 'col-4',
              type: "date",
              placeholder: `${t("vitrandate")}`,
              onChange: (e: any) => setVitrandate(e.target.value),
            },

            {
              label: `${t("selectInstallment")}`,
              value: Installment,
              required: true,
              className: isResponsive ? 'col-12' : 'col-4',
              type: "text",
              placeholder: `${t("selectInstallment")}`,
              onChange: (e: React.ChangeEvent<HTMLInputElement>) => {
                const selectedInstallment = e.target.value;

                const estimatedAmount = Workmasters
                  .filter((type) =>
                    String(type.representative_id) as any == requirementid &&
                    String(type.id) == selectwork
                  )
                  .map((yojna: any) => yojna.estimated_amount)
                  .reduce((acc, amount) => acc + amount, 0); // Sum up estimated amounts

                setInstallment(selectedInstallment);
                setpercentage((selectedInstallment as any / 100) * estimatedAmount as any);
              },
            },
            {
              label: `${t("enteramount")}`,
              value: percentage,
              required: true,
              type: "text",
              className: isResponsive ? 'col-12' : 'col-4',
              placeholder: `${t("enteramount")}`,
              onChange: (e: any) => setAmount(percentage),
            },
            {
              label: `${t("enterimage")}`,
              value: "", // The value for file input is always empty (HTML behavior)
              type: "file",
              className: isResponsive ? 'col-12' : 'col-4',
              placeholder: `${t("enterimage")}`,
              onChange: handleImageChange, // Handle image change here
            },
            {
              label: `${t("Latitude")}`,
              value: latitude,
              type: "text",
              className: isResponsive ? 'col-12' : 'col-4',

              placeholder: `${t("Latitude")}`,
              onChange: (e: any) => setLatitude(latitude),
            },
            {
              label: `${t("Longitude")}`,
              value: longitude,
              className: isResponsive ? 'col-12' : 'col-4',
              type: "text",
              placeholder: `${t("Longitude")}`,
              onChange: (e: any) => setLongitude(longitude),
            },
            {
              label: `${t("enteraddress")}`,
              value: Adress,
              className: isResponsive ? 'col-12' : 'col-4',
              type: "text",
              required: true,
              placeholder: `${t("enteraddress")}`,
              onChange: (e: any) => setAdress(e.target.value),
            },
          ],
          error,
        }}
        submitButtonLabel={
          updateClusterId
            ? isLoading
              ? "Submitting..."
              : t("editsubmit")
            : isLoading
              ? "Submitting..."
              : t("submit")
        }
        disabledButton={isLoading}
      />
    </div>
  );
};

export default Disbursementfunds;
