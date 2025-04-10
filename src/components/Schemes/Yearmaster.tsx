// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Categorys, YojanaYear } from "../type";

import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validateyojnayear } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
  initialcategoryData: YojanaYear[];
};

const Yearmaster = ({ initialcategoryData }: Props) => {
  const t = useTranslations("yojnayear");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [yojnayear, setYojnayear] = useState("");
  const [appyojna, setAppyojna] = useState("No");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
  const [clusterData, setClusterData] =
    useState<YojanaYear[]>(initialcategoryData); // State for Category data
  const confirm = createConfirmation(ConfirmationDialog);

  const data = clusterData
    .map((cluster) => ({
      yojana_year_id: cluster.yojana_year_id,
      yojana_year: cluster.yojana_year,
      status: cluster.year_status,


    }))
    .reverse(); // Reverse the order to show the last added items first

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
      accessorKey: "yojana_year",
      header: `${t("year")}`,
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
            {t("editsubmit")}
          </button>
          <button
            className={`btn btn-sm ${row.original.status == "Y" ? "btn-danger" : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.yojana_year_id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status == "Y"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
        </div>
      ),
    },
  ];

  const handleDeactivate = async (yojana_year_id: any, year_status: any) => {
    const confirmMessage =
      year_status == "Active"
        ? "Are you sure you want to deactivate this Year?"
        : "Are you sure you want to activate this Year?";
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const response = await fetch(`/api/yearmaster/delete/${yojana_year_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            year_status: year_status == "Y" ? "N" : "Y",
          }),
        });

        if (response.ok) {
          // Update local state without page reload
          setClusterData((prevData) =>
            prevData.map((cluster) =>
              cluster.yojana_year_id == yojana_year_id
                ? {
                  ...cluster,
                  year_status: year_status == "Y" ? "N" : "Y",
                }
                : cluster
            )
          );
          toast.success(
            `Year ${year_status == "Y" ? "deactivated" : "activated"
            } successfully!`
          );
        } else {
          toast.error("Failed to change the Year status.");
        }
      } catch (error) {
        console.error("Error changing the Year status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setIsLoading(true);

    try {
      const method = updateClusterId ? "PUT" : "POST";
      const url = updateClusterId
        ? `/api/yearmaster/update`
        : `/api/yearmaster/insert`;

      const requestBody = {
        yojana_year: yojnayear,
        ...(updateClusterId && { yojana_year_id: updateClusterId }),
      };

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestBody),
      });

      const responseData = await response.json(); // parse the response

      if (response.ok) {
        if (updateClusterId) {
          setClusterData((prevData) =>
            prevData.map((cluster) =>
              cluster.yojana_year_id == updateClusterId
                ? { ...cluster, category_name: yojnayear, for_app: appyojna }
                : cluster
            )
          );
          toast.success("Year updated successfully!");
        } else {
          setClusterData((prevData) => [...prevData, responseData]);
          toast.success("Year inserted successfully!");
        }

        resetform();
        handleClosePrint();
      } else {
        if (response.status === 400 && responseData.message === "Yojana year already exists.") {
          toast.error("Yojana year already exists!");
        } else {
          toast.error(`Failed to ${updateClusterId ? "update" : "insert"} cluster.`);
        }
      }
    } catch (error) {
      console.error("Error during operation:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleEdit = (cluster: any) => {
    setUpdateClusterId(cluster.category_id); // Set ID for updating
    setYojnayear(cluster.category_name); // Set current name for editing
    setAppyojna(cluster.for_app); // Set current name for editing
    handleShowPrint(); // Open modal for editing
  };

  const handleShowPrint = () => setShowPrintModal(true);
  const resetform = () => {
    setYojnayear("");
    setAppyojna("");
  }
  const handleClosePrint = () => {
    resetform();
    setShowPrintModal(false);
    setYojnayear("");
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
            {t("submit")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={updateClusterId ? `${t("year")}` : `${t("year")}`}
        formData={{
          fields: [
            {
              label: `${t("year")}`,
              value: yojnayear,
              type: "textwithoutval",

              placeholder: `${t("year")}`,

              onChange: (e: any) => setYojnayear(e.target.value),
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

export default Yearmaster;
