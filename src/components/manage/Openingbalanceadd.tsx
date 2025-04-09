// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { OpeningBalance, YojanaYear } from "../type";
import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
import { validationOpenBalance } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { createConfirmation } from "react-confirm";

type Props = {
  initialOpenBalanceData: OpeningBalance[];
  YojnaYear: YojanaYear[];
};

const Openingbalanceadd = ({ initialOpenBalanceData, YojnaYear }: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [openbalance, setOpenBalanceAdd] = useState("");
  const [bankyear, setbankYear] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
  const [openbalanceData, setopenbalanceData] = useState<OpeningBalance[]>(
    initialOpenBalanceData
  ); // State for cluster data
  const t = useTranslations("PraranbhikSillak");
  const confirm = createConfirmation(ConfirmationDialog);

  const yojna_year = YojnaYear.reduce((acc, year: YojanaYear) => {
    acc[year.yojana_year_id] = year.yojana_year; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);

  const data = openbalanceData
    .map((balance) => ({
      open_bal_id: balance.open_bal_id,
      open_bal: balance.open_bal,
      year_id: yojna_year[balance.year_id],
      y_id: balance.year_id,
      status: balance.status,
      ins_date_time:
        typeof balance.ins_date_time === "string"
          ? formatDate(balance.ins_date_time)
          : formatDate(balance.ins_date_time.toISOString()),
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
      accessorKey: "open_bal",
      header: `${t("enteramount")}`,
    },
    {
      accessorKey: "year_id",
      header: `${t("year")}`,
    },
    {
      accessorKey: "status",
      header: `${t("status")}`,
    },
    {
      accessorKey: "ins_date_time",
      header: `${t("addtime")}`,
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
              handleDeactivate(row.original.open_bal_id, row.original.status)
            }
          >
            {" "}
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === "Active"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
        </div>
      ),
    },
  ];

  const handleDeactivate = async (balanceid: any, currentStatus: any) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this Openbalance?"
        : "Are you sure you want to activate this Openbalance?";
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const response = await fetch(
          `/api/openbalanceadd/delete/${balanceid}`,
          {
            method: "PATCH",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              status: currentStatus === "Active" ? "Deactive" : "Active",
            }),
          }
        );

        if (response.ok) {
          // Update local state without page reload
          setopenbalanceData((prevData) =>
            prevData.map((cluster) =>
              cluster.open_bal_id === balanceid
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

    // const errorMsg = validationOpenBalance(bankyear, openbalance);

    // if (errorMsg.length > 0) {
    //   setError(errorMsg.join("<br />"));
    //   return;
    // }
    setIsLoading(true); // Start loading

    // Ensure the id is included for updates
    const bodyData = {
      open_bal: openbalance,
      year_id: bankyear,
      open_bal_id: updateClusterId,
    };

    try {
      const method = updateClusterId ? "PUT" : "POST";
      const url = updateClusterId
        ? `/api/openbalanceadd/update`
        : `/api/openbalanceadd/insert`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        if (!updateClusterId) {
          // If inserting a new entry
          const balancedata = await response.json();

          setopenbalanceData((prevData) => [...prevData, balancedata]);
        } else {
          // If updating an existing entry
          setopenbalanceData((prevData: any) =>
            prevData.map((balance: any) =>
              balance.open_bal_id === updateClusterId
                ? { ...balance, ...bodyData }
                : balance
            )
          );
        }
        alert(
          `Village ${updateClusterId ? "updated" : "inserted"} successfully!`
        );
        handleClosePrint();

        // Optionally refresh the table data here
      } else {
        const data = await response.json();
        alert(
          `Failed to ${updateClusterId ? "update" : "insert"} Village: ${data.error
          }`
        );
      }
    } catch (error) {
      console.error("Error during operation:", error);
      alert("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = (ed: any) => {
    setUpdateClusterId(ed.open_bal_id); // Set ID for updating
    setOpenBalanceAdd(ed.open_bal); // Set current name for editing
    setbankYear(ed.y_id);
    handleShowPrint(); // Open modal for editing
  };

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    setOpenBalanceAdd("");
    setbankYear("");
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
            {t("addbalance")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={updateClusterId ? `${t("updatepage")}` : `${t("insertpage")}`}
        formData={{
          fields: [
            {
              label: `${t("selectyear")}`,
              value: bankyear,
              onChange: (e: any) => setbankYear(e.target.value),
              type: "select",
              options: YojnaYear.map((year: YojanaYear) => ({
                value: year.yojana_year_id,
                label: year.yojana_year,
              })),
              placeholder: `${t("selectyear")}`, // Optional placeholder for select input
            },
            {
              label: `${t("enteramount")}`,
              value: openbalance,
              required: true,
              type: "text",
              placeholder: `${t("enteramount")}`,

              onChange: (e: any) => setOpenBalanceAdd(e.target.value),
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

export default Openingbalanceadd;
