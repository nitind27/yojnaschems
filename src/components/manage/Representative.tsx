"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
import type { Representative } from "../type";
import { validaterepresentative } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { createConfirmation } from "react-confirm";

const STATUS_MESSAGES = {
  ACTIVE: "Active",
  DEACTIVE: "Deactive",
  SUCCESS_INSERT: "Representative inserted successfully!",
  SUCCESS_UPDATE: "Representative updated successfully!",
  SUCCESS_ACTIVATE: "Representative activated successfully!",
  SUCCESS_DEACTIVATE: "Representative deactivated successfully!",
  ERROR_UPDATE: "Failed to update Representative.",
  ERROR_INSERT: "Failed to insert Representative.",
  ERROR_STATUS_CHANGE: "Failed to change the Representative status:",
};

type Props = {
  initialRepresentative: Representative[];
};

const Representative = ({ initialRepresentative }: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [representativeName, setrepresentativeName] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [error, setError] = useState<string>("");
  const [representativeId, setUpdateRepresentative] = useState<bigint | null>(
    null
  );
  const [representative, setRepresentative] = useState<Representative[]>(
    initialRepresentative
  );
  const t = useTranslations("Representative");
  const confirm = createConfirmation(ConfirmationDialog);

  const data = representative
    .map(({ id, name, status }) => ({
      id,
      name,
      status,
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
      accessorKey: "name",
      header: `${t("pratinidhi")}`,
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
            className={`btn btn-sm ${row.original.status === STATUS_MESSAGES.ACTIVE
                ? "btn-danger"
                : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.id, row.original.status)
            }
          >
            {" "}
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === STATUS_MESSAGES.ACTIVE
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
        </div>
      ),
    },
  ];

  const handleDeactivate = async (
    id: number | string,
    currentStatus: string
  ) => {
    const newStatus =
      currentStatus === STATUS_MESSAGES.ACTIVE
        ? STATUS_MESSAGES.DEACTIVE
        : STATUS_MESSAGES.ACTIVE;
    const confirmMessage = `Are you sure you want to ${newStatus.toLowerCase()} this Representative?`;
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const response = await fetch(`/api/Representative/delete/${id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          setRepresentative((prevData) =>
            prevData.map((rep: any) =>
              rep.id === id ? { ...rep, status: newStatus } : rep
            )
          );
          toast.success(
            newStatus === STATUS_MESSAGES.ACTIVE
              ? STATUS_MESSAGES.SUCCESS_ACTIVATE
              : STATUS_MESSAGES.SUCCESS_DEACTIVATE
          );
        } else {
          const errorData = await response.json();
          toast.error(
            `${STATUS_MESSAGES.ERROR_STATUS_CHANGE} ${errorData.error || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error changing the Representative status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    setrepresentativeName(""); // Clear input field on close
    setUpdateRepresentative(null); // Reset ID on close
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // const errorMsg = validaterepresentative(representativeName);
    // if (errorMsg) {
    //   setError(errorMsg);
    //   return;
    // }

    setIsLoading(true); // Start loading

    try {
      const method = representativeId ? "PUT" : "POST";
      const url = representativeId
        ? `/api/Representative/update`
        : `/api/Representative/insert`;

      const bodyData = {
        name: representativeName,
        ...(representativeId && { id: representativeId }), // Include ID only if updating
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        if (representativeId) {
          // Update local state for updated Representative
          setRepresentative((prevData) =>
            prevData.map((rep) =>
              rep.id === representativeId
                ? { ...rep, name: representativeName }
                : rep
            )
          );
          toast.success(STATUS_MESSAGES.SUCCESS_UPDATE);
        } else {
          // Handle the newly created Representative response
          const createdData = await response.json(); // Assuming the response contains the created data
          setRepresentative((prevData) => [...prevData, createdData]); // Add created data to state
          toast.success(STATUS_MESSAGES.SUCCESS_INSERT);
        }

        handleClosePrint();
      } else {
        toast.error(
          representativeId
            ? STATUS_MESSAGES.ERROR_UPDATE
            : STATUS_MESSAGES.ERROR_INSERT
        );
      }
    } catch (error) {
      console.error("Error during operation:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = (representative: any) => {
    setUpdateRepresentative(representative.id); // Set the ID of the facility being edited
    setrepresentativeName(representative.name); // Set the name for editing
    handleShowPrint(); // Show the modal for editing
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
            {t("addrepresentative")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={representativeId ? `${t("updatepage")}` : `${t("insertpage")}`}
        formData={{
          fields: [
            {
              label: `${t("enterrepresentativename")}`,
              value: representativeName,
              type: "text",
              required: true,
              placeholder: `${t("enterrepresentativename")}`,
              onChange: (e: any) => setrepresentativeName(e.target.value),
              // errorMessage: error,
            },
          ],
          error,
        }}
        submitButtonLabel={
          representativeId
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

export default Representative;
