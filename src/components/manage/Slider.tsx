// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { clusterdata, TblSlider } from "../type";
import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";

import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import Loader from "@/common/Loader ";

type Props = {
    Slidertbl: TblSlider[];
};

const Slider = ({ Slidertbl }: Props) => {
    const t = useTranslations("IndexPage");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [Imagename, setImagename] = useState("");
    const [error, setError] = useState<string>("");
    const [insertImage, setInsertImage] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [clusterData, setClusterData] =
        useState<TblSlider[]>(Slidertbl); // State for cluster data
    const confirm = createConfirmation(ConfirmationDialog);

    const data = clusterData
        .map((cluster) => ({
            cluster_id: cluster.slider_id,
            cluster_name: cluster.slider_name,
            status: cluster.slider_img,
            img_type: cluster.img_type,

        }))
        .reverse(); // Reverse the order to show the last added items first

    const columns = [
        {
            accessorKey: "serial_number", // Use a new accessor for the serial number
            header: `${t("Srno")}`, // Header for the serial number
            cell: ({ row }: any) => (
                <div>
                    {row.index + 1} {/* Display the index + 1 for serial number */}
                </div>
            ),
        },

        {
            accessorKey: "cluster_name",
            header: `${t("Imagename")}`,
        },
        // {
        //   accessorKey: "status",
        //   header: `${t("Status")}`,
        // },

        {
            accessorKey: "status",
            header: `${t("status")}`,
            cell: ({ row }: any) => (
                <div style={{ display: "flex", whiteSpace: "nowrap" }}>
                    <img src={row.original.status} width={100} height={50} />
                    {row.original.status}
                </div>
            ),
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
                        {" "}
                        <KTIcon iconName={"pencil"} className="fs-6" iconType="solid" />
                        {t("edit")}
                    </button>
                    <button
                        className={`btn btn-sm ${row.original.status === "Active" ? "btn-danger" : "btn-warning"
                            } ms-5`}
                        onClick={() =>
                            handleDeactivate(row.original.cluster_id, row.original.status)
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

    const handleDeactivate = async (clusterId: any, currentStatus: any) => {
        const confirmMessage =
            currentStatus === "Active"
                ? "Are you sure you want to deactivate this cluster?"
                : "Are you sure you want to activate this cluster?";
        const confirmed = await confirm({ confirmation: confirmMessage });
        if (confirmed) {
            try {
                const response = await fetch(`/api/clustersapi/clusters/${clusterId}`, {
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
                            cluster.slider_id === clusterId
                                ? {
                                    ...cluster,
                                    status: currentStatus === "Active" ? "Deactive" : "Active",
                                }
                                : cluster
                        )
                    );
                    toast.success(
                        `Cluster ${currentStatus === "Active" ? "deactivated" : "activated"
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

    
    const handleSubmit = async (event: React.FormEvent) => {
      event.preventDefault();
      // Create FormData to handle both file and form data
      const formData = new FormData();
      formData.append("slider_name", Imagename);
      
      
      formData.append("img_type", "slider");
      // Add the image file to the form data if there's an image to upload
      if (insertImage) {
          formData.append("slider_img", insertImage);
      }
      setIsLoading(true); // Start loading
  
      try {
        // Determine if this is an insert or update operation
        const method = updateClusterId ? "PATCH" : "POST";
        const url = updateClusterId
          ? `/api/slider/update` // If updating, call the update endpoint
          : `/api/slider/insert`; // If inserting, call the insert endpoint
  
        // If updating, include the cluster ID
        if (updateClusterId) {
          formData.append("notifi_id", updateClusterId.toString());
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
            // setNotificaionData((prevData) => [...prevData, createdData]);
            toast.success("Notification inserted successfully!");
          } else {
            // If updating an existing entry, update the specific item in the state
            // setNotificaionData((prevData: any) =>
            //   prevData.map((cluster: any) =>
            //     cluster.notifi_id === updateClusterId
            //       ? { ...cluster, ...createdData }
            //       : cluster
            //   )
            // );
            toast.success("Notification updated successfully!");
          }
  
          // Reset form and close modal after successful submission
        //   resetForm();
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
    const handleEdit = (cluster: any) => {
        setUpdateClusterId(cluster.cluster_id); // Set ID for updating
        setImagename(cluster.cluster_name); // Set current name for editing
        handleShowPrint(); // Open modal for editing
    };

    const handleShowPrint = () => setShowPrintModal(true);

    const handleClosePrint = () => {
        setShowPrintModal(false);
        setImagename("");
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
                        {t("AddCluster")}
                    </Button>
                }
            />

            <CustomModal
                show={showPrintModal}
                handleClose={handleClosePrint}
                handleSubmit={handleSubmit}
                title={updateClusterId ? `${t("updatepage")}` : `${t("insertpage")}`}
                imagepriview={
                    imagePreview && (
                        <img
                            src={imagePreview}
                            alt="Preview"
                            style={{
                                width: "150px", // Set a fixed width for the circular effect
                                height: "150px", // Set a fixed height equal to width
                                borderRadius: "5%", // Make the image circular
                                objectFit: "cover", // Ensure the image covers the circular area
                                overflow: "hidden", // Hide overflow to keep the circle shape
                            }}
                        />
                    )
                }
                formData={{
                    fields: [
                        {
                            label: `${t("enterImagename")}`,
                            value: Imagename,
                            type: "text",
                            placeholder: `${t("enterImagename")}`,
                            required: true,
                            onChange: (e: any) => setImagename(e.target.value),
                        },
                        {
                            label: `${t("img")}`,
                            value: "", // The value for file input is always empty (HTML behavior)
                            type: "file",
                            placeholder: `${t("img")}`,
                            onChange: handleImageChange, // Handle image change here
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

export default Slider;
