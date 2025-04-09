"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import type {
  Bank,
  grampanchayat,
  talukasdata,
  Villages,
  YojanaYear,
} from "../type";
import { toast } from "react-toastify";
import { formatDate } from "@/lib/utils";
import { validationBank } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
  Villages: Villages[];
  talukas: talukasdata[]; // To store the fetched talukasData
  grampanchayat: grampanchayat[];
  initialBankData: Bank[];
  YojnaYear: YojanaYear[];
};

const BankData = ({ initialBankData, YojnaYear }: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [bankName, setBankName] = useState("");
  const [accountNo, setaccountNo] = useState("");
  const [yojanayearid, setyojanayearid] = useState<number | string>("");
  const [amount, setamount] = useState<number | string>("");
  const [isLoading, setIsLoading] = useState(false);

  const [status, setStatus] = useState<string>("Active");
  const [error, setError] = useState<string>("");
  const [updateTownId, setUpdateTownId] = useState<number | null>(null);

  const [BankData, setBankData] = useState<Bank[]>(initialBankData);
  const t = useTranslations("Bank");
  const confirm = createConfirmation(ConfirmationDialog);

  const yojna_year = YojnaYear.reduce((acc, year: YojanaYear) => {
    acc[year.yojana_year_id] = year.yojana_year; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);

  const data = BankData.map((BankData) => ({
    id: BankData.id,
    name: BankData.name,
    year_id: BankData.yojana_year_id,
    account_no: BankData.account_no,
    yojana_year_id: yojna_year[BankData.yojana_year_id],
    amount: BankData.amount,
    status: BankData.status,
    // ins_date_time:BankData.ins_date_time,
    ins_date_time:
      typeof BankData.ins_date_time === "string"
        ? formatDate(BankData.ins_date_time)
        : formatDate(BankData.ins_date_time.toISOString()),
  })).reverse();

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
    { accessorKey: "name", header: `${t("Bankname")}` },
    { accessorKey: "account_no", header: `${t("accoutno")}` },
    { accessorKey: "yojana_year_id", header: `${t("yojna")}` },
    { accessorKey: "amount", header: `${t("amount")}` },
    { accessorKey: "status", header: `${t("status")}` },
    { accessorKey: "ins_date_time", header: `${t("addtime")}` },

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
    bankid: number | string,
    currentStatus: string
  ) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this Bank?"
        : "Are you sure you want to activate this Bank?";

    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const newStatus = currentStatus === "Active" ? "Deactive" : "Active";

        const response = await fetch(`/api/bank/delete/${bankid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          setBankData((prevData) =>
            prevData.map((mahasul) =>
              mahasul.id === bankid
                ? { ...mahasul, status: newStatus }
                : mahasul
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
    resetForm();
  };

  const resetForm = () => {
    setBankName("");
    setaccountNo("");
    setyojanayearid("");
    setamount("");

    setStatus("Active");
    setError("");
    setUpdateTownId(null);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // const errorMsg = validationBank(
    //   bankName,
    //   accountNo,
    //   yojanayearid,
    //   String(amount)
    // );

    // if (errorMsg.length > 0) {
    //   setError(errorMsg.join("<br />"));
    //   return;
    // }
    setIsLoading(true); // Start loading

    // Ensure the id is included for updates
    const bodyData = {
      id: updateTownId, // Include the ID for updates
      yojana_year_id: yojanayearid,
      name: bankName,
      account_no: accountNo,
      amount,
      status,
    };

    try {
      const method = updateTownId ? "PUT" : "POST";
      const url = updateTownId ? `/api/bank/update` : `/api/bank/insert`;

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        if (!updateTownId) {
          // If inserting a new entry
          const bankdata = await response.json();

          setBankData((prevData) => [...prevData, bankdata]);
        } else {
          // If updating an existing entry
          setBankData((prevData: any) =>
            prevData.map((balance: any) =>
              balance.id === updateTownId
                ? { ...balance, ...bodyData }
                : balance
            )
          );
        }
        alert(`Village ${updateTownId ? "updated" : "inserted"} successfully!`);
        handleClosePrint();
        // Optionally refresh the table data here
      } else {
        const data = await response.json();
        alert(
          `Failed to ${updateTownId ? "update" : "insert"} Village: ${data.error
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

  const handleEdit = (gp: any) => {
    setUpdateTownId(gp.id);
    setBankName(gp.name); // Use gp.gp_id to set the bankName
    setaccountNo(gp.account_no);
    setyojanayearid(gp.year_id);
    setamount(gp.amount);

    setStatus(gp.status);

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

            {t("addbank")}
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
              label: `${t("selectyear")}`,
              value: yojanayearid,
              onChange: (e: any) => setyojanayearid(e.target.value),
              type: "select",
              options: YojnaYear.map((year: YojanaYear) => ({
                value: year.yojana_year_id,
                label: year.yojana_year,
              })),
              placeholder: `${t("selectyear")}`, // Optional placeholder for select input
            },
            {
              label: `${t("enterbankname")}`,
              value: bankName, // Ensure this uses bankName
              type: "text",
              required: true,
              placeholder: `${t("enterbankname")}`,
              onChange: (e: any) => setBankName(e.target.value), // Keep this to set bankName
            },

            {
              label: `${t("enteraccountno")}`,
              value: accountNo || "",
              type: "text",
              required: true,
              placeholder: `${t("enteraccountno")}`,

              onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 16) {
                  setaccountNo(inputValue);
                }
              },
            },

            {
              label: `${t("enteramount")}`,
              value: amount || "",
              required: true,
              type: "text",
              placeholder: `${t("enteramount")}`,
              onChange: (e: any) => setamount(e.target.value),
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
    </div>
  );
};

export default BankData;
