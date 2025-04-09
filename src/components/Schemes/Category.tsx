// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Categorys } from "../type";

import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validatecategoryName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
  initialcategoryData: Categorys[];
};

const Category = ({ initialcategoryData }: Props) => {
  const t = useTranslations("Category");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [appyojna, setAppyojna] = useState("No");
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
  const [clusterData, setClusterData] =
    useState<Categorys[]>(initialcategoryData); // State for Category data
  const confirm = createConfirmation(ConfirmationDialog);

  const data = clusterData
    .map((cluster) => ({
      category_id: cluster.category_id,
      category_name: cluster.category_name,
      status: cluster.status,
      for_app: cluster.for_app,

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
      accessorKey: "category_name",
      header: `${t("categoryname")}`,
    },
    {
      accessorKey: "status",
      header: `${t("status")}`,
    },

    {
      accessorKey: "for_app",
      header: `${t("appyojna")}`,
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
            className={`btn btn-sm ${row.original.status == "Active" ? "btn-danger" : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.category_id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status == "Active"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
        </div>
      ),
    },
  ];

  const handleDeactivate = async (category_id: any, currentStatus: any) => {
    const confirmMessage =
      currentStatus == "Active"
        ? "Are you sure you want to deactivate this category?"
        : "Are you sure you want to activate this category?";
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const response = await fetch(`/api/category/delete/${category_id}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: currentStatus == "Active" ? "Deactive" : "Active",
          }),
        });

        if (response.ok) {
          // Update local state without page reload
          setClusterData((prevData) =>
            prevData.map((cluster) =>
              cluster.category_id == category_id
                ? {
                  ...cluster,
                  status: currentStatus == "Active" ? "Deactive" : "Active",
                }
                : cluster
            )
          );
          toast.success(
            `Category ${currentStatus == "Active" ? "deactivated" : "activated"
            } successfully!`
          );
        } else {
          toast.error("Failed to change the Category status.");
        }
      } catch (error) {
        console.error("Error changing the Category status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // const errorMsg = validatecategoryName(categoryName);
    // if (errorMsg) {
    //   setError(errorMsg);
    //   return;
    // }

    setIsLoading(true); // Start loading

    try {
      const method = updateClusterId ? "PUT" : "POST";
      const url = updateClusterId
        ? `/api/category/update`
        : `/api/category/insert`;

      // Prepare the request body
      const requestBody = {
        category_name: categoryName,
        for_app: appyojna,

        ...(updateClusterId && { category_id: updateClusterId }),
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
              cluster.category_id == updateClusterId
                ? { ...cluster, category_name: categoryName, for_app: appyojna }
                : cluster
            )
          );
          toast.success("Category updated successfully!");
          resetform();
        } else {
          const createdData = await response.json();
          setClusterData((prevData) => [...prevData, createdData]);
          toast.success("Category inserted successfully!");
          resetform();
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
    setUpdateClusterId(cluster.category_id); // Set ID for updating
    setCategoryName(cluster.category_name); // Set current name for editing
    setAppyojna(cluster.for_app); // Set current name for editing
    handleShowPrint(); // Open modal for editing
  };

  const handleShowPrint = () => setShowPrintModal(true);
  const resetform = () => {
    setCategoryName("");
    setAppyojna("");
  }
  const handleClosePrint = () => {
    resetform();
    setShowPrintModal(false);
    setCategoryName("");
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
            {t("addcategory")}
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
              label: `${t("categoryname")}`,
              value: categoryName,
              type: "text",
              required: true,
              placeholder: `${t("categoryname")}`,

              onChange: (e : any) => setCategoryName(e.target.value),
            },
            {
              label: `${t("appyojna")}`,
              value: appyojna,
              type: "select",
              placeholder: `${t("appyojna")}`,

              options: [
                { label: "Yes", value: "Yes" },
                { label: "No", value: "No" },

              ],
              onChange: (e : any) => setAppyojna(e.target.value),
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

export default Category;
