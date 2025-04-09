// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { clusterdata, talukasdata, Tblbankmaster } from "../type";
import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validateBankname } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
  Bankdata: Tblbankmaster[];
  talukas:talukasdata[];
};

const BankMaster = ({ Bankdata ,talukas}: Props) => {
  const t = useTranslations("Bankmaster");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [Bankname, setBankName] = useState("");
      const [dist, setDist] = useState("");
      const [IFSCCode, setIFSCCode] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
  const [clusterData, setClusterData] =
    useState<Tblbankmaster[]>(Bankdata); // State for cluster data
  const confirm = createConfirmation(ConfirmationDialog);
  const talukaMap = talukas.reduce((acc, taluka: any) => {
    acc[taluka.id] = taluka.name; // Assuming taluka has id and name properties
    return acc;
}, {} as Record<number, string>);
  const data = clusterData
    .map((cluster) => ({
      cluster_id: cluster.id,
      Bankname: cluster.bank_name,
      taluka_name: cluster.talukaid,
      talukaname: talukaMap[cluster.talukaid as any],
  ifsc_code: cluster.ifsc_code,
      status: cluster.status,

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
      accessorKey: "talukaname",
      header: `${t("Dist")}`,
    },
    {
      accessorKey: "Bankname",
      header: `${t("BankName")}`,
    },
    {
      accessorKey: "ifsc_code",
      header: `${t("IFSCCode")}`,
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
        const response = await fetch(`/api/bankmaster/delete/${clusterId}`, {
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
              cluster.id == clusterId
                ? {
                  ...cluster,
                  status: currentStatus === "Active" ? "Deactive" : "Active",
                }
                : cluster
            )
          );
          toast.success(
            `Bank Details ${currentStatus === "Active" ? "deactivated" : "activated"
            } successfully!`
          );
        } else {
          toast.error("Failed to change the Bank Details status.");
        }
      } catch (error) {
        console.error("Error changing the Bank Details status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true); // Start loading

    try {
        const method = updateClusterId ? "PUT" : "POST";
        const url = updateClusterId
            ? `/api/bankmaster/update`
            : `/api/bankmaster/insert`;

        const requestBody = {
            bank_name: Bankname,
            ifsc_code: IFSCCode,
            talukaid: dist,

            ...(updateClusterId && { id: updateClusterId }),
        };

        const response = await fetch(url, {
            method,
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(requestBody),
        });

        if (response.ok) {
            if (updateClusterId) {
                setClusterData((prevData) =>
                    prevData.map((cluster) =>
                        cluster.id === updateClusterId
                            ? { ...cluster, bank_name: Bankname,ifsc_code:IFSCCode,talukaid:Number(dist) }
                            : cluster
                    )
                );
                toast.success("Bank Details updated successfully!");
            } else {
                const createdData = await response.json();
                setClusterData((prevData) => [...prevData, createdData]);
                toast.success("Bank Details inserted successfully!");
            }

            handleClosePrint();
        } else if (response.status === 409) {
            // Handle conflict error
            const errorData = await response.json();
            toast.error(`${errorData.message || 'IFSC code already exist'}`);
        } else {
            // Handle other errors
            const error = await response.json();
            toast.error(
                `Failed to ${updateClusterId ? "update" : "insert"} Bank Details. ${error.message || 'An unexpected error occurred.'}`
            );
        }
    } catch (error) {
        console.error("Error during operation:", error);
        toast.error("An unexpected error occurred.");
    } finally {
        setIsLoading(false); // End loading
    }
};


  const handleEdit = (cluster: any) => {
    setUpdateClusterId(cluster.cluster_id); 
    setDist(cluster.taluka_name);
    setIFSCCode(cluster.ifsc_code)
    setBankName(cluster.Bankname); 
    handleShowPrint(); 
  };

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    setBankName("");
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
        title={updateClusterId ? `${t("title")}` : `${t("title")}`}
        formData={{
          fields: [
            {
              label: `${t('Dist')}`,
              value: dist,
              onChange: (e: any) => setDist(e.target.value),
              type: "select",
              options: talukas.map((taluka: any) => ({
                  value: taluka.id,
                  label: taluka.name,
              })),
              placeholder: `${t("Dist")}`, // Optional placeholder for select input
          },
            {
              label: `${t("BankName")}`,
              value: Bankname,
              type: "text",
              placeholder: `${t("BankName")}`,
              required: true,
              onChange: (e: any) => setBankName(e.target.value),
            },
            {
              label: `${t("IFSCCode")}`,
              value: IFSCCode,
              type: "text",
              placeholder: `${t("IFSCCode")}`,
              required: true,
              onChange: (e: any) => setIFSCCode(e.target.value),
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

export default BankMaster;
