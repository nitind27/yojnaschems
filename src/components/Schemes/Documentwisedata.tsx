
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Bank, Categorys, Document, DocumentYojana, SubCategory, TblYojanaType, YojanaMaster, YojanaYear } from "../type";

import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
import { useRouter } from 'next/navigation';

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
    Documentdatas: Document[];
    yojnawiseDocumentdatas: DocumentYojana[];

};

const Documentwisedata = ({ initialcategoryData, YojnaYear, Bankdata, category, yojnatype, yojnamaster, Documentdatas, yojnawiseDocumentdatas }: Props) => {
    const t = useTranslations("Plans");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [categoryName, setCategoryName] = useState("");
    const [subcategoryName, setSubCategoryName] = useState("");
    const [yojnayear, setYojnaYear] = useState("");
    const [yojnatyp, setYojnatype] = useState("");
    const [yojnname, setyojnaname] = useState("");
    const [Document, setDocument] = useState<string[]>([]);

    const router = useRouter();
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [yojnamasterdata, setYojnamaster] =
        useState<DocumentYojana[]>(yojnawiseDocumentdatas); // State for cluster data
    const [documentdatastate, setDocumentdatastate] =
        useState<Document[]>(Documentdatas); // State for cluster data

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
    const documentfetch = documentdatastate.reduce((acc, year: any) => {
        // Assuming year.document_id can be an array of IDs
        if (Array.isArray(year.document_id)) {
            year.document_id.forEach((id: any) => {
                acc[id] = year.document_name; // This might need adjustment based on your actual data structure
            });
        } else {
            acc[year.document_id] = year.document_name;
        }
        return acc;
    }, {} as Record<number, string>);


    const data = yojnamasterdata
        .map((master: any) => ({
            document_id: master.document_id,
            category_id: categorydata[master.category_id as any],
            categoryid: master.category_id,
            subcategory_id: subcat[master.subcategory_id as any],
            subcategoryid: master.subcategory_id,
            documentdataid: master.documents,
            documents: documentdatastate.filter((data) => {
                // Ensure both are of the same type (e.g., string)
                return master.documents?.includes(String(data.document_id));
            }).map((data) => data.document_name).join(" | "),
            yojana_name: master.yojana_id,
            yojana_nameid: yojnatypes[master.yojana_id],
            status: master.status,
        }))
        .reverse(); // Reverse the order to show the last added items first

    const columns = [
        {
            accessorKey: "serial_number",
            header: () => (
                <div style={{ fontWeight: 'bold', padding: '5px' }}>
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
            accessorKey: "subcategory_id",
            header: `${t("subcategoryname")}`,
        },

        {
            accessorKey: "yojana_nameid",
            header: `Yojna Type`,
        },
        {
            accessorKey: "documents",
            header: `Documents`,
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
                    {/* <button
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
                    </button> */}
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
                            cluster.document_id === category_id
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
                ? `/api/documentwisedata/update`
                : `/api/documentwisedata/insert`;

            // Prepare the request body
            const requestBody = {
                category_id: categoryName,
                subcategory_id: subcategoryName,
                yojana_id: yojnatyp,
                documents: !Array.isArray(Document) ? documentdataofwise.map((data: any) => data.value).join() : Document.map((data: any) => data.value).join(),


                ...(updateClusterId && { document_id: updateClusterId }),
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
                    router.refresh();
                    setYojnamaster((prevData) =>
                        prevData.map((cluster) =>
                            cluster.document_id === updateClusterId
                                ? {
                                    ...cluster,
                                    subcategory_id: parseInt(subcategoryName),
                                    category_id: parseInt(categoryName),
                                    yojana_id: parseInt(yojnatyp),
                                    documents: Document as any,
                                    yojana_name: yojnatyp,
                                    documentdataid: Document as any, // Possibly redundant
                                }
                                : cluster
                        )
                    );
                    setDocumentdatastate((prevData) =>
                        prevData.map((cluster) =>
                            cluster.document_id === updateClusterId
                                ? {
                                    ...cluster,

                                    documents: Document as any,

                                    documentdataid: Document as any, // Possibly redundant
                                }
                                : cluster
                        )
                    );

                    window.location.reload();
                    toast.success("Cluster updated successfully!");
                } else {
                    const createdData = await response.json();
                    setYojnamaster((prevData) => [...prevData, createdData]);
                    toast.success("Cluster inserted successfully!");
                }

                handleClosePrint();
            } else {
                console.log("checkerror", error)
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
        setUpdateClusterId(null);
        setCategoryName("")
        setSubCategoryName("")
        setYojnaYear("")
        setYojnatype("")
        setyojnaname("")
        setDocument([])
    }
    const handleEdit = (yojna: any) => {
        setUpdateClusterId(yojna.document_id);
        setCategoryName(yojna.categoryid)
        setSubCategoryName(yojna.subcategoryid)

        setYojnatype(yojna.yojana_name)

        setDocument(yojna.documentdataid)
        handleShowPrint();
    };

    const handleShowPrint = () => setShowPrintModal(true);

    const handleClosePrint = () => {
        setShowPrintModal(false);
        setCategoryName("");
        setError("");
        setUpdateClusterId(null); // Reset update ID when closing
        reset();
    };

    const documentdataofwise = documentdatastate
        .filter((data: any) => Document.includes(data.document_id))
        .map((data) => ({
            label: data.document_name,
            value: data.document_id,
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
                        {t("addplan")}
                    </Button>
                }
            />

            <CustomModal
                show={showPrintModal}
                selectoption={[]}
                handleClose={handleClosePrint}
                handleSubmit={handleSubmit}
                title={updateClusterId ? `Scheme Wise Documents` : `Scheme Wise Document`}
                formData={{
                    fields: [
                        {
                            label: `${t("categoryname")}`,
                            value: categoryName,
                            onChange: (e: any) => setCategoryName(e.target.value),
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
                            onChange: (e: any) => setSubCategoryName(e.target.value), // Function to update selected subcategory
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
                            onChange: (e: any) => setYojnatype(e.target.value),
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
                            label: `Document`,
                            value: updateClusterId ? documentdatastate
                                .filter((data: any) => Document.includes(data.document_id))
                                .map((data) => ({
                                    label: data.document_name,
                                    value: data.document_id,
                                })) : Document,
                            type: "selectcustom",
                            placeholder: `${t("amount")}`,
                            options: Documentdatas.map((category: Document) => ({
                                value: category.document_id, // Assuming sub_category_id is the unique identifier for subcategories
                                label: category.document_name,
                            })),
                            required: true,
                            onChange: (e: any) => setDocument(e.target.value),
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

export default Documentwisedata;
