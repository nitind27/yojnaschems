
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Bank, Categorys, SubCategory, TblYojanaType, YojanaMaster, YojanaYear } from "../type";

import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";

import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
    initialcategoryData: SubCategory[];
    YojnaYear: YojanaYear[];
    Bankdata: Bank[];
    category: Categorys[];
    yojnatype: TblYojanaType[];
    yojnamaster: YojanaMaster[];
};

const Plans = ({ initialcategoryData, YojnaYear, Bankdata, category, yojnatype, yojnamaster }: Props) => {
    const t = useTranslations("Plans");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [subcategoryName, setSubCategoryName] = useState("");
    const [yojnayear, setYojnaYear] = useState("");
    const [yojnatyp, setYojnatype] = useState("");
    const [yojnname, setyojnaname] = useState("");
    const [amount, setAmount] = useState("");

    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [yojnamasterdata, setYojnamaster] =
        useState<YojanaMaster[]>(yojnamaster); // State for cluster data
    const confirm = createConfirmation(ConfirmationDialog);
    const yojna_year = YojnaYear.reduce((acc, year: YojanaYear) => {
        acc[year.yojana_year_id] = year.yojana_year; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const subcat = initialcategoryData.reduce((acc, subcat: SubCategory) => {
        acc[subcat.sub_category_id] = subcat.sub_category_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const categorydata = category.reduce((acc, year: Categorys) => {
        acc[year.category_id] = year.category_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const yojnatypes = yojnatype.reduce((acc, year: any) => {
        acc[year.yojana_type_id] = year.yojana_type; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const data = yojnamasterdata
        .map((master) => ({
            yojana_id: master.yojana_id,
            category_id: categorydata[master.category_id],
            categoryid: master.category_id,
            sub_category_id: subcat[master.sub_category_id],
            subcategoryid: master.sub_category_id,
            yojana_name: master.yojana_name,
            date_ins: master.date_ins,
            uddesh_swarup: master.uddesh_swarup,
            patrata: master.patrata,
            sampark: master.sampark,
            is_delete: master.is_delete,
            status: master.status,
            gat: master.gat,
            yojana_year_id: yojna_year[master.yojana_year_id],
            yojanayearid: master.yojana_year_id,
            yojana_type: yojnatypes[master.yojana_type as any],
            yojanatype: master.yojana_type,
            amount: master.amount,


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
            accessorKey: "yojana_year_id",
            header: `${t("year")}`,
        },
        {
            accessorKey: "yojana_name",
            header: `${t("yojnaname")}`,
        },
        {
            accessorKey: "status",
            header: `${t("Status")}`,
        },

        {
            accessorKey: "yojana_type",
            header: `${t("yojnatype")}`,
        },
        {
            accessorKey: "amount",
            header: `${t("amount")}`,
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
                            handleDeactivate(row.original.yojana_id, row.original.status)
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
                ? "Are you sure you want to deactivate this cluster?"
                : "Are you sure you want to activate this cluster?";
        const confirmed = await confirm({ confirmation: confirmMessage });
        if (confirmed) {
            try {
                const response = await fetch(`/api/yojnamaster/delete/${category_id}`, {
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
                    setYojnamaster((prevData) =>
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
                ? `/api/yojnamaster/update`
                : `/api/yojnamaster/insert`;

            // Prepare the request body
            const requestBody = {
                category_id: categoryName,
                sub_category_id: subcategoryName,
                yojana_type: yojnatyp,
                yojana_year_id: yojnayear,
                yojana_name: yojnname,
                amount: amount,


                ...(updateClusterId && { yojana_id: updateClusterId }),
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
                    setYojnamaster((prevData) =>
                        prevData.map((cluster) =>
                            cluster.yojana_id === updateClusterId
                                ? { ...cluster, sub_category_id: parseInt(subcategoryName), category_id: parseInt(categoryName), yojana_type: yojnatyp, amount: amount as any, yojana_year_id: parseInt(yojnayear), yojana_name: yojnname, }
                                : cluster
                        )
                    );
                    toast.success("Cluster updated successfully!");
                } else {
                    const createdData = await response.json();
                    setYojnamaster((prevData) => [...prevData, createdData]);
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


    const reset = () => {
        setUpdateClusterId(null); // Set ID for updating
        setCategoryName("")
        setSubCategoryName("")
        setYojnaYear("")
        setYojnatype("")
        setyojnaname("")
        setAmount("")
    }
    const handleEdit = (yojna: any) => {
        setUpdateClusterId(yojna.yojana_id); // Set ID for updating
        setCategoryName(yojna.categoryid)
        setSubCategoryName(yojna.subcategoryid)
        setYojnaYear(yojna.yojanayearid)
        setYojnatype(yojna.yojanatype)
        setyojnaname(yojna.yojana_name)
        setAmount(yojna.amount)
        handleShowPrint(); // Open modal for editing
    };




    const handleShowPrint = () => setShowPrintModal(true);

    const handleClosePrint = () => {
        setShowPrintModal(false);
        setCategoryName("");
        setError("");
        setUpdateClusterId(null); // Reset update ID when closing
        reset();
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
                        {t("addplan")}
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
                            value: yojnatyp,
                            onChange: (e : any) => setYojnatype(e.target.value),
                            type: "select",
                            options: yojnatype
                                .filter((type) =>
                                    String(type.sub_category_id) == subcategoryName &&
                                    String(type.category_id) == categoryName
                                )
                                .map((yojna) => ({
                                    value: yojna.yojana_type_id,
                                    label: yojna.yojana_type,
                                })),
                            placeholder: `${t("yojnatype")}`, // Optional placeholder for select input
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
                            label: `${t("yojnaname")}`,
                            value: yojnname,
                            type: "text",
                            placeholder: `${t("yojnaname")}`,
                            required: true,
                            onChange: (e : any) => setyojnaname(e.target.value),
                        },

                        {
                            label: `${t("amount")}`,
                            value: amount,
                            type: "text",
                            placeholder: `${t("amount")}`,
                            required: true,
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

export default Plans;
