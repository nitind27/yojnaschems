// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Bank, Categorys, SubCategory, YojanaYear } from "../type";

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
    YojnaYear: YojanaYear[];
    Bankdata: Bank[];
    category: Categorys[];
};

const SubCategorys = ({ initialcategoryData, YojnaYear, Bankdata, category }: Props) => {
    const t = useTranslations("Subcategory");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [subcategoryName, setSubCategoryName] = useState("");
    const [yojnayear, setYojnaYear] = useState("");
    const [bankname, setBankname] = useState("");
    const [amount, setAmount] = useState("");
    const [appyojna, setAppyojna] = useState("No");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [clusterData, setClusterData] =
        useState<SubCategory[]>(initialcategoryData); // State for Sub Category data
    const confirm = createConfirmation(ConfirmationDialog);
    const yojna_year = YojnaYear.reduce((acc, year: YojanaYear) => {
        acc[year.yojana_year_id] = year.yojana_year; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const bankdata = Bankdata.reduce((acc, year: Bank) => {
        acc[year.id] = year.name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const categorydata = category.reduce((acc, year: Categorys) => {
        acc[year.category_id] = year.category_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const data = clusterData
        .map((subcategory) => ({
            sub_category_id: subcategory.sub_category_id,
            category_id: categorydata[subcategory.category_id],
            categoryid: subcategory.category_id,
            sub_category_name: subcategory.sub_category_name,
            bank_id: bankdata[subcategory.bank_id],
            bankid: subcategory.bank_id,
            yojana_year_id: yojna_year[subcategory.yojana_year_id],
            yojanayearid: subcategory.yojana_year_id,
            amount: subcategory.amount,
            status: subcategory.status,
            created_at: subcategory.created_at,
            updated_at: subcategory.updated_at,
            for_app: subcategory.for_app,

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
            accessorKey: "sub_category_name",
            header: `${t("subcategoryname")}`,
        },
        {
            accessorKey: "yojana_year_id",
            header: `${t("year")}`,
        },
        {
            accessorKey: "bank_id",
            header: `Bankname`,
        },
        {
            accessorKey: "amount",
            header: `${t("amount")}`,
        },
        {
            accessorKey: "status",
            header: `${t("Status")}`,
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
                        className={`btn btn-sm ${row.original.status === "Active" ? "btn-danger" : "btn-warning"
                            } ms-5`}
                        onClick={() =>
                            handleDeactivate(row.original.sub_category_id, row.original.status)
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
                ? "Are you sure you want to deactivate this subCategory ?"
                : "Are you sure you want to activate this subCategory?";
        const confirmed = await confirm({ confirmation: confirmMessage });
        if (confirmed) {
            try {
                const response = await fetch(`/api/subcategory/delete/${category_id}`, {
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
                            cluster.sub_category_id === category_id
                                ? {
                                    ...cluster,
                                    status: currentStatus === "Active" ? "Deactive" : "Active",
                                }
                                : cluster
                        )
                    );
                    toast.success(
                        `Sub Category ${currentStatus === "Active" ? "deactivated" : "activated"
                        } successfully!`
                    );
                } else {
                    toast.error("Failed to change the Sub Category status.");
                }
            } catch (error) {
                console.error("Error changing the Sub Category status:", error);
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
                ? `/api/subcategory/update`
                : `/api/subcategory/insert`;

            // Prepare the request body
            const requestBody = {
                category_id: categoryName,
                sub_category_name: subcategoryName,
                yojana_year_id: yojnayear,
                bank_id: bankname,
                amount: amount,


                ...(updateClusterId && { sub_category_id: updateClusterId }),
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
                            cluster.sub_category_id === updateClusterId
                                ? { ...cluster, sub_category_name: subcategoryName, category_id: parseInt(categoryName), bank_id: parseInt(bankname), amount: amount as any, yojana_year_id: parseInt(yojnayear) }
                                : cluster
                        )
                    );
                    toast.success("Sub Category updated successfully!");
                } else {
                    const createdData = await response.json();
                    setClusterData((prevData) => [...prevData, createdData]);
                    toast.success("Sub Category inserted successfully!");
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
        setUpdateClusterId(cluster.sub_category_id); // Set ID for updating
        setCategoryName(cluster.categoryid); // Set current name for editing
        setSubCategoryName(cluster.sub_category_name)
        setAmount(cluster.amount)
        setYojnaYear(cluster.yojanayearid)
        setBankname(cluster.bankid)
        handleShowPrint(); // Open modal for editing
    };

    const handleShowPrint = () => setShowPrintModal(true);
    const reset = () => {
        setCategoryName("");
        setSubCategoryName("");
        setYojnaYear("");
        setBankname("");
        setError("");
        setAmount("");
        
    }
    const handleClosePrint = () => {
        reset();
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
                        {t("addsubcategory")}
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
                            onChange: (e : any) => setCategoryName(e.target.value),
                            type: "select",
                            options: category.map((category: Categorys) => ({
                                value: category.category_id,
                                label: category.category_name,
                            })),
                            placeholder: `${t("categoryname")}`, // Optional placeholder for select input
                        },
                        {
                            label: `${t("subcategoryname")}`,
                            value: subcategoryName,
                            type: "text",
                            placeholder: `${t("subcategoryname")}`,

                            onChange: (e : any) => setSubCategoryName(e.target.value),
                        },
                        {
                            label: `${t("year")}`,
                            value: yojnayear,
                            onChange: (e : any) => setYojnaYear(e.target.value),
                            type: "select",
                            options: YojnaYear.map((year: YojanaYear) => ({
                                value: year.yojana_year_id,
                                label: year.yojana_year,
                            })),
                            placeholder: `${t("year")}`, // Optional placeholder for select input
                        },


                        {
                            label: `${t("Bankname")}`,
                            value: bankname,
                            onChange: (e : any) => setBankname(e.target.value),
                            type: "select",
                            options: Bankdata.map((Bank: Bank) => ({
                                value: Bank.id,
                                label: Bank.name,
                            })),
                            placeholder: `${t("Bankname")}`, // Optional placeholder for select input
                        },
                        {
                            label: `${t("amount")}`,
                            value: amount,
                            required: true,
                            type: "text",
                            placeholder: `${t("amount")}`,

                            onChange: (e : any) => setAmount(e.target.value),
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

export default SubCategorys;
