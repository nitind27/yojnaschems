"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { talukasdata } from "../type";
import { toast } from "react-toastify";
import { validateTalukaName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import Loader from "@/common/Loader ";

type Props = {
  talukasdata: talukasdata[];
};

const TalukaData = ({ talukasdata }: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [townName, setTownName] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateTownId, setUpdateTownId] = useState<BigInt | null>(null);
  const [localTalukasData, setLocalTalukasData] =
    useState<talukasdata[]>(talukasdata); // Local state for talukas data
  const t = useTranslations("Townpage");
  const confirm = createConfirmation(ConfirmationDialog);

  const data = localTalukasData
    .map((taluka) => ({
      id: taluka.id,
      name: taluka.name,
      name_marathi: taluka.name_marathi,
      status: taluka.status,
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
    // { accessorKey: "id", header: "ID" },
    { accessorKey: "name", header: `${t("taluka")}` },
    { accessorKey: "name_marathi", header: `${t("marathiname")}` },
    { accessorKey: "status", header: `${t("Status")}` },
    {
      accessorKey: "actions",
      header: `${t("Action")}`,
      cell: ({ row }: any) => (
        <div>
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

  const handleDeactivate = async (talukaId: BigInt, currentStatus: string) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this Taluka?"
        : "Are you sure you want to activate this Taluka?";

    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const newStatus = currentStatus === "Active" ? "Deactive" : "Active";
        const response = await fetch(`/api/townapi/town/delete/${talukaId}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          // Update local state without page reload
          setLocalTalukasData((prevData) =>
            prevData.map((taluka: any) =>
              taluka.id === talukaId ? { ...taluka, status: newStatus } : taluka
            )
          );
          toast.success(
            `Cluster ${newStatus === "Active" ? "activated" : "deactivated"
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
    setTownName("");
    setError("");
    setUpdateTownId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // const errorMsg = validateTalukaName(townName);
    // if (errorMsg) {
    //   setError(errorMsg);
    //   return;
    // }
    setIsLoading(true); // Start loading
    try {
      const method = updateTownId ? "PUT" : "POST";
      const url = updateTownId
        ? `/api/townapi/town/update`
        : `/api/townapi/town/insert`;

      // Prepare data for submission
      const bodyData = {
        name: townName,
        ...(updateTownId && { id: updateTownId.toString() }), // Convert BigInt to string
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        if (updateTownId) {
          // Update local state for edited Taluka
          setLocalTalukasData((prevData) =>
            prevData.map((taluka: any) =>
              taluka.id === updateTownId
                ? { ...taluka, name: townName }
                : taluka
            )
          );
          toast.success("Taluka updated successfully!");
        } else {
          // Assuming API returns the newly created object including its ID
          const newTaluka = await response.json();
          setLocalTalukasData((prevData) => [...prevData, newTaluka]);
          toast.success("Taluka inserted successfully!");
        }

        handleClosePrint();
      } else {
        const data = await response.json();
        toast.error(
          `Failed to ${updateTownId ? "update" : "insert"} Taluka: ${data.error
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

  const handleEdit = (taluka: any) => {
    setUpdateTownId(taluka.id);
    setTownName(taluka.name);
    handleShowPrint();
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
            {t("addtaluka")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={updateTownId ? `${t("updatepage")}` : `${t("insertpage")}`}
        formData={{
          fields: [
            {
              label: `${t("entertalukaname")}`,
              value: townName,
              type: "text",
              required: true,
              placeholder: `${t("entertalukaname")}`,
              error,
              onChange: (e: any) => setTownName(e.target.value),
            },
          ],
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
    </div>
  );
};

export default TalukaData;
