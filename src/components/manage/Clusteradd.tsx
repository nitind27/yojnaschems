// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { clusterdata } from "../type";
import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
import { validateClusterName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import Loader from "@/common/Loader ";

type Props = {
  initialClusterData: clusterdata[];
};

const Clusteradd = ({ initialClusterData }: Props) => {
  const t = useTranslations("IndexPage");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [clusterName, setClusterName] = useState("");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
  const [clusterData, setClusterData] =
    useState<clusterdata[]>(initialClusterData); // State for cluster data
  const confirm = createConfirmation(ConfirmationDialog);

  const data = clusterData
    .map((cluster) => ({
      cluster_id: cluster.cluster_id,
      cluster_name: cluster.cluster_name,
      status: cluster.status,
      ins_date_time:
        typeof cluster.ins_date_time === "string"
          ? formatDate(cluster.ins_date_time)
          : formatDate(cluster.ins_date_time.toISOString()),
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
      header: `${t("clustername")}`,
    },
    {
      accessorKey: "status",
      header: `${t("Status")}`,
    },
    {
      accessorKey: "ins_date_time",
      header: `${t("AddTime")}`,
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
              cluster.cluster_id === clusterId
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

    setIsLoading(true); // Start loading

    try {
      const method = updateClusterId ? "PUT" : "POST";
      const url = updateClusterId
        ? `/api/clustersapi/update/updateCluster`
        : `/api/clustersapi/insert/clusters`;

      // Prepare the request body
      const requestBody = {
        cluster_name: clusterName,
        ...(updateClusterId && { cluster_id: updateClusterId }),
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
              cluster.cluster_id === updateClusterId
                ? { ...cluster, cluster_name: clusterName }
                : cluster
            )
          );
          toast.success("Cluster updated successfully!");
        } else {
          const createdData = await response.json();
          setClusterData((prevData) => [...prevData, createdData]);
          toast.success("Cluster inserted successfully!");
        }

        handleClosePrint();
      } else {
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

  const handleEdit = (cluster: any) => {
    setUpdateClusterId(cluster.cluster_id); // Set ID for updating
    setClusterName(cluster.cluster_name); // Set current name for editing
    handleShowPrint(); // Open modal for editing
  };

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    setClusterName("");
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
        formData={{
          fields: [
            {
              label: `${t("enterclustername")}`,
              value: clusterName,
              type: "text",
              placeholder: `${t("enterclustername")}`,
              required: true,
              onChange: (e: any) => setClusterName(e.target.value),
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

export default Clusteradd;
