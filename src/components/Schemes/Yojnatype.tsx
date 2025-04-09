// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Bank, Categorys, clusterdata, SubCategory, TblYojanaType, YojanaYear } from "../type";
import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validatecategoryName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
    initialcategoryData: SubCategory[];
    yojnatype: TblYojanaType[];
    Bankdata: Bank[];
    category: Categorys[];
};

const Yojnatype = ({ initialcategoryData, yojnatype, Bankdata, category }: Props) => {
    const t = useTranslations("Yojnatype");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [subcategoryName, setSubCategoryName] = useState("");
    const [yojnatypes, setYojnaType] = useState("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [clusterData, setClusterData] =
        useState<TblYojanaType[]>(yojnatype); // State for Yojna Type data
    const confirm = createConfirmation(ConfirmationDialog);

    const categorydata = category.reduce((acc, year: Categorys) => {
        acc[year.category_id] = year.category_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const subcategorydata = initialcategoryData.reduce((acc, year: SubCategory) => {
        acc[year.sub_category_id] = year.sub_category_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const data = clusterData
        .map((subcategory) => ({
            yojana_type_id: subcategory.yojana_type_id,
            category_id: categorydata[subcategory.category_id],
            categoryid: subcategory.category_id,
            sub_category_id: subcategorydata[subcategory.sub_category_id],
            subcategoryid: subcategory.sub_category_id,
            yojana_type: subcategory.yojana_type,
            status: subcategory.status,
        }))
        .reverse(); // Reverse the order to show the last added items first

    const columns = [
       {
            accessorKey: "serial_number",
            header: () => (
                <div style={{ fontWeight: 'bold',padding: '5px' }}>
                    {t("SrNo")}
                </div>
            ),
            cell: ({ row }: any) => (
                <div>
                    {row.index + 1}
                </div>
            ),
        },
        {
            accessorKey: "category_id",
            header: `${t("categoryname")}`,
        },
        {
            accessorKey: "sub_category_id",
            header: `${t("subcategoryname")}`,
        },
        {
            accessorKey: "yojana_type",
            header: `${t("yojnatype")}`,
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
                            handleDeactivate(row.original.yojana_type_id, row.original.status)
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

    const handleDeactivate = async (category_id: any, currentStatus: any) => {
        const confirmMessage =
            currentStatus === "Active"
                ? "Are you sure you want to deactivate this Yojnatype?"
                : "Are you sure you want to activate this Yojnatype?";
        const confirmed = await confirm({ confirmation: confirmMessage });
        if (confirmed) {
            try {
                const response = await fetch(`/api/yojnatype/delete/${category_id}`, {
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
                            cluster.yojana_type_id === category_id
                                ? {
                                    ...cluster,
                                    status: currentStatus === "Active" ? "Deactive" : "Active",
                                }
                                : cluster
                        )
                    );
                    toast.success(
                        `Yojna Type ${currentStatus === "Active" ? "deactivated" : "activated"
                        } successfully!`
                    );
                } else {
                    toast.error("Failed to change the Yojna Type status.");
                }
            } catch (error) {
                console.error("Error changing the Yojna Type status:", error);
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
                ? `/api/yojnatype/update`
                : `/api/yojnatype/insert`;

            // Prepare the request body
            const requestBody = {
                category_id: categoryName,
                sub_category_id: subcategoryName,
                yojana_type: yojnatypes,

                ...(updateClusterId && { yojana_type_id: updateClusterId }),
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
                            cluster.yojana_type_id === updateClusterId
                                ? { ...cluster, sub_category_id: parseInt(subcategoryName), category_id: parseInt(categoryName), yojana_type: yojnatypes, }
                                : cluster
                        )
                    );
                    toast.success("Yojna Type updated successfully!");
                } else {
                    const createdData = await response.json();
                    setClusterData((prevData) => [...prevData, createdData]);
                    toast.success("Yojna Type inserted successfully!");
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
        setUpdateClusterId(cluster.yojana_type_id); // Set ID for updating
        setCategoryName(cluster.categoryid); // Set current name for editing
        setSubCategoryName(cluster.subcategoryid)
        setYojnaType(cluster.yojana_type);
        handleShowPrint(); // Open modal for editing
    };

    const handleShowPrint = () => setShowPrintModal(true);

    const handleClosePrint = () => {
        setShowPrintModal(false);
        setCategoryName("");
        setError("");
        setUpdateClusterId(null); // Reset update ID when closing
    };

    const ad = initialcategoryData
        .filter((category: SubCategory) => String(category.category_id) === categoryName) // Filter to match category_id with categoryName
        .map((category: SubCategory) => ({
            value: category.category_id, // Value for the select option
            label: category.sub_category_name, // Display name for the select option
        }))
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
                        {t("addyojna")}
                    </Button>
                }
            />
            {ad.length}
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
                            onChange: (e : any) => setCategoryName(e.target.value),
                            type: "select",
                            options: category.map((category: Categorys) => ({
                                value: category.category_id,
                                label: category.category_name,
                            })),
                            placeholder: `${t("categoryname")}`, // Optional placeholder for select input
                        },
                        {
                            label: `${t("subcategoryname")}`, // Label for the select input
                            value: subcategoryName, // Use state for the selected subcategory
                            onChange: (e : any) => setSubCategoryName(e.target.value), // Function to update selected subcategory
                            type: "select", // Type of input
                            options: initialcategoryData
                                .filter((category: SubCategory) => String(category.category_id) == categoryName) // Filter based on categoryName
                                .map((category: SubCategory) => ({
                                    value: category.sub_category_id, // Assuming sub_category_id is the unique identifier for subcategories
                                    label: category.sub_category_name, // Display name for the select option
                                })),
                            placeholder: `${t("subcategoryname")}`, // Optional placeholder for select input
                        },
                        {
                            label: `${t("yojnatype")}`,
                            value: yojnatypes,
                            type: "text",
                            required: true,
                            placeholder: `${t("yojnatype")}`,

                            onChange: (e : any) => setYojnaType(e.target.value),
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

export default Yojnatype;
