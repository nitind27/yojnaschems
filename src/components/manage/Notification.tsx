"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Notificationdata } from "../type";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
import { useTranslations } from "next-intl";
import Image from "next/image";
import Link from "next/link";

type Props = {
  initialnotificationdata: Notificationdata[];
};
const Notification = ({ initialnotificationdata }: Props) => {
  const t = useTranslations("Notification");

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [notificationtype, setNotificationType] = useState("");
  const [details, setDetails] = useState("");
  const [links, setLinks] = useState("");
  const [newicon, setNewicon] = useState("");
  const [header, setHeader] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string>("");
  const [updateClusterId, setUpdateClusterId] = useState<bigint | null>(null);
  const [notificationData, setNotificaionData] = useState<Notificationdata[]>(
    initialnotificationdata
  ); // State for  // State for cluster data
  const [insertImage, setInsertImage] = React.useState<File | null>(null); // File object for the selected image

  const [imagePreview, setImagePreview] = React.useState<string>("");
  const data = notificationData
    .map((notificaiton) => ({
      notifi_id: notificaiton.notifi_id,
      notifications_type: notificaiton.notifications_type,
      details: notificaiton.details,
      links: notificaiton.links,
      new_icon: notificaiton.new_icon,
      add_date: notificaiton.add_date,
      header: notificaiton.header,
      img: notificaiton.img,
      status: notificaiton.status,
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
      accessorKey: "notifications_type",
      header: `${t("notificationtype")}`,
    },
    {
      accessorKey: "details",
      header: `${t("Detail")}`,
    },
    {
      accessorKey: "links",
      header: `${t("link")}`,
    },
    {
      accessorKey: "new_icon",
      header: `${t("new_icon")}`,
    },
    {
      accessorKey: "add_date",
      header: `${t("add_date")}`,
    },
    {
      accessorKey: "header",
      header: `${t("header")}`,
    },
    // {
    //   accessorKey: "img",
    //   header: `${t('img')}`,
    // },

    {
      accessorKey: "img",
      header: `${t("img")}`,
      cell: ({ row }: any) => {
        const photoSrc = row.original.img.startsWith("/")
          ? row.original.img
          : `/${row.original.img}`;
        return (
          <div style={{ textAlign: "center" }}>
            <Image
              src={photoSrc}
              alt={t("img")}
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
      header: `${t("Status")}`,
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
            className={`btn btn-sm ${row.original.status === "Start" ? "btn-danger" : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.notifi_id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === "Start"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
        </div>
      ),
    },
  ];

  const handleDeactivate = async (id: any, currentStatus: any) => {
    const confirmMessage =
      currentStatus === "Start"
        ? "Are you sure you want to deactivate this Notification?"
        : "Are you sure you want to activate this Notification?";

    if (window.confirm(confirmMessage)) {
      try {
        const response = await fetch(`/api/notification/delete/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: currentStatus === "Start" ? "Stop" : "Start",
          }),
        });

        if (response.ok) {
          // Update local state without page reload
          setNotificaionData((prevData: any) =>
            prevData.map((cluster: any) =>
              cluster.notifi_id === id
                ? {
                  ...cluster,
                  status: currentStatus === "Start" ? "Stop" : "Start",
                }
                : cluster
            )
          );
          toast.success(
            `Notification ${currentStatus === "Start" ? "deactivated" : "activated"
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
    setNotificationType("");
    setDetails("");
    setLinks("");
    setNewicon("");
    setHeader("");

    setImagePreview("");

    setUpdateClusterId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Create FormData to handle both file and form data
    const formData = new FormData();
    formData.append("notifications_type", notificationtype);
    formData.append("details", details);

    formData.append("links", links);
    formData.append("new_icon", newicon);
    formData.append("header", header);

    // Add the image file to the form data if there's an image to upload
    if (insertImage) {
      formData.append("img", insertImage);
    }
    setIsLoading(true); // Start loading

    try {
      // Determine if this is an insert or update operation
      const method = updateClusterId ? "PATCH" : "POST";
      const url = updateClusterId
        ? `/api/notification/update` // If updating, call the update endpoint
        : `/api/notification/insert`; // If inserting, call the insert endpoint

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
          setNotificaionData((prevData) => [...prevData, createdData]);
          toast.success("Notification inserted successfully!");
        } else {
          // If updating an existing entry, update the specific item in the state
          setNotificaionData((prevData: any) =>
            prevData.map((cluster: any) =>
              cluster.notifi_id === updateClusterId
                ? { ...cluster, ...createdData }
                : cluster
            )
          );
          toast.success("Notification updated successfully!");
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
  const handleEdit = (noti: any) => {
    setUpdateClusterId(noti.notifi_id);
    setNotificationType(noti.notifications_type.toString());
    setDetails(noti.details);
    setLinks(noti.links);
    setNewicon(noti.new_icon);
    setHeader(noti.header);
    setImagePreview(noti.img);

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
            {t("addnotification")}
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
              label: `${t("notificationtype")}`,
              value: notificationtype,
              type: "select",
              placeholder: `${t("notificationtype")}`,
              options: [
                { label: "Notice", value: "Notice" },
                { label: "Event", value: "Event" },
                { label: "News", value: "News" },
                // Add other options here if needed
              ],
              onChange: (e: any) => setNotificationType(e.target.value),
            },
            {
              label: `${t("Detail")}`,
              value: details,
              type: "textwithoutval",
              // required: true,
              placeholder: `${t("Detail")}`,

              onChange: (e: any) => setDetails(e.target.value),
            },
            {
              label: `${t("link")}`,
              value: links,
              // required: true,
              type: "url",
              placeholder: `${t("link")}`,

              onChange: (e: any) => setLinks(e.target.value),
            },
            {
              label: `${t("new_icon")}`,
              value: newicon,
              type: "select",

              placeholder: `Select Icon`,
              onChange: (e: any) => setNewicon(e.target.value), // Keep this to set townName
              options: [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
              ],
            },
            {
              label: `${t("header")}`,
              value: header,
              type: "select",
              placeholder: `Select Header`,
              onChange: (e: any) => setHeader(e.target.value), // Keep this to set townName
              options: [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },
                // Add other options here if needed
              ],
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

export default Notification;
