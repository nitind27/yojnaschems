"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { Facility } from "../type";
import { toast } from "react-toastify";
import { validateSuvidhaname } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
  initialfacilitydata: Facility[];
};

const Suvidha = ({ initialfacilitydata }: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [suvidhaName, setSuvidhaName] = useState("");
  const [error, setError] = useState<string>("");
  const [suvidhaid, setUpdateSuvidha] = useState<BigInt | null>(null);
  const [facilitydata, setFacility] = useState<Facility[]>(initialfacilitydata);
  const t = useTranslations("Suvidha");
  const confirm = createConfirmation(ConfirmationDialog);
  const [isLoading, setIsLoading] = useState(false);

  const data = facilitydata
    .map((suvidha) => ({
      id: suvidha.id,
      name: suvidha.name,
      status: suvidha.status,
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
      header: `${t("suvidhaname")}`,
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

  const handleDeactivate = async (
    grampanchayatid: number | string,
    currentStatus: string
  ) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this Suvidha?"
        : "Are you sure you want to activate this Suvidha?";
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const newStatus = currentStatus === "Active" ? "Deactive" : "Active";
        const response = await fetch(`/api/suvidha/delete/${grampanchayatid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          setFacility((prevData) =>
            prevData.map((taluka: any) =>
              taluka.id == grampanchayatid
                ? { ...taluka, status: newStatus }
                : taluka
            )
          );
          toast.success(
            `Suvidha ${newStatus === "Active" ? "activated" : "deactivated"
            } successfully!`
          );
        } else {
          const errorData = await response.json();
          toast.error(
            `Failed to change the Suvidha status: ${errorData.error || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error changing the Suvidha status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    setSuvidhaName(""); // Clear input field on close
    setUpdateSuvidha(null); // Reset ID on close
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // const errorMsg = validateSuvidhaname(suvidhaName);
    // if (errorMsg) {
    //   setError(errorMsg);
    //   return;
    // }
    setIsLoading(true); // Start loading

    try {
      const method = suvidhaid ? "PUT" : "POST";
      const url = suvidhaid ? `/api/suvidha/update` : `/api/suvidha/insert`;

      const bodyData = {
        name: suvidhaName,
        ...(suvidhaid && { id: suvidhaid.toString() }), // Convert BigInt to string
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        if (suvidhaid) {
          setFacility((prevData) =>
            prevData.map((suvidha) =>
              suvidha.id === suvidhaid
                ? { ...suvidha, name: suvidhaName }
                : suvidha
            )
          );
          toast.success("Suvidha updated successfully!");
        } else {
          const createdData = await response.json();
          setFacility((prevData) => [...prevData, createdData]);
          toast.success("Suvidha inserted successfully!");
        }

        handleClosePrint();
      } else {
        const errorData = await response.json();
        toast.error(
          `Failed to ${suvidhaid ? "update" : "insert"} Suvidha: ${errorData.message || "Unknown error"
          }`
        );
      }
    } catch (error) {
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = (suvidha: any) => {
    setUpdateSuvidha(suvidha.id); // Set the ID of the facility being edited
    setSuvidhaName(suvidha.name); // Set the name for editing
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
            {t("addsuvidha")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={suvidhaid ? `${t("updatepage")}` : `${t("insertpage")}`}
        formData={{
          fields: [
            {
              label: `${t("entersuvidhaname")}`, // Updated label for clarity
              value: suvidhaName,
              required: true,
              type: "text",
              placeholder: `${t("entersuvidhaname")}`, // Updated placeholder for clarity
              onChange: (e: any) => setSuvidhaName(e.target.value),
            },
          ],
          error,
        }}
        submitButtonLabel={
          suvidhaid
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

export default Suvidha;
