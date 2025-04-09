// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import * as XLSX from 'xlsx';

import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
import { validateClusterName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

import { clusterdata, Schooldata, Standarddata, StudentData, TblAchivments, TblSportsInfoNew } from "@/components/type";
import TableOption from "@/components/table/TableOption";
import Link from "next/link";

type Props = {
    filtersportsInfo: TblSportsInfoNew[];
    studentdata: StudentData[];
    schooldata: Schooldata[];
    standarddata: Standarddata[];
    TblAchivments: TblAchivments[];
};

const Sporttable = ({ filtersportsInfo, studentdata, schooldata, standarddata, TblAchivments }: Props) => {
    const t = useTranslations("IndexPage"); console.log("TblAchivments", TblAchivments)
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showPrintModalachivements, setShowPrintModalachivements] = useState(false);
    const [clusterName, setClusterName] = useState("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [clusterData, setClusterData] =
        useState<TblSportsInfoNew[]>(filtersportsInfo); // State for cluster data
    const confirm = createConfirmation(ConfirmationDialog);
    const students = studentdata.reduce((acc, student: any) => {
        acc[student.student_id] = student.full_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const schools = schooldata.reduce((acc, school: any) => {
        acc[school.school_id] = school.school_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const standardmap = standarddata.reduce((acc, standard: Standarddata) => {
        acc[standard.standard_id] = standard.standard_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const data = clusterData
        .map((cluster) => ({
            sports_info_id: cluster.sports_info_id,
            std: standardmap[cluster.sports_record.split("|")[3] as any],
            studentname: cluster.sports_record.split("|")[2],
            student_name: students[cluster.sports_record.split("|")[2] as any],
            stdname: cluster.sports_record.split("|")[0],
            std_name: schools[cluster.sports_record.split("|")[0] as any],
            status: cluster.status,
            //   ins_date_time:
            //     typeof cluster.update_date_time === "string"
            //       ? formatDate(cluster.update_date_time)
            //       : formatDate(cluster.update_date_time.toISOString()),
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
            accessorKey: "student_name",
            header: `Student Name`,
        },
        {
            accessorKey: "std_name",
            header: `School Name`,
        },


        {
            accessorKey: "std",
            header: `Standard`,
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
                    <button onClick={() =>
                        handleDeactivate(row.original.sports_info_id, row.original.status)
                    } className="btn btn-warning">

                        View Achievement

                    </button>

                </div>
            ),
        },
    ];

    const handleDeactivate = async (clusterId: any, currentStatus: any) => {
        const confirmMessage =

            TblAchivments
                .filter((data) => data.sports_id == clusterId)
                .map((data) => data.details)
                .join("\n");


        const confirmed = await confirm({ confirmation: confirmMessage });

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
                            cluster.sports_info_id === updateClusterId
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


    let options;

    if (true) {

        options = standarddata.map((std) => ({
            value: std.standard_name,
            label: std.standard_name,
        }));
    } console.log('checkop', options)


    let schoolnameoption;
    if (true) {

        schoolnameoption = schooldata.map((student) => ({
            value: student.school_name,
            label: student.school_name,
        }));
    }
    let scholarshipoption;

    console.log('schoolnameoption', schoolnameoption)

    if (true) {

        scholarshipoption = [
            {
                value: "",
                label: "",
            },
        ];
    }
    const downloadExcel = () => {
        // Transform data for better compatibility with Excel
        const transformedData = data.map((student, index) => ({
            Index: index + 1, // Adding index number starting from 1
            FullName: student.student_name, // Join names and filter nulls
            SchoolName: student.std_name, // Join contact numbers or default to "N/A"
            Std: student.std, // Join array into a string
            // Default value for scholarship name
        }));

        // Define custom headings as an array of strings
        const headings = [
            "Index",
            "Full Name",
            "School Name",
            "Standard",

        ];

        // Combine headings with transformed data
        const finalData = [headings, ...transformedData.map(({ Index, FullName, SchoolName, Std }) =>
            [Index, FullName, SchoolName, Std])];

        // Create worksheet and workbook
        const worksheet = XLSX.utils.aoa_to_sheet(finalData); // Use aoa_to_sheet for array of arrays
        const workbook = XLSX.utils.book_new();
        XLSX.utils.book_append_sheet(workbook, worksheet, "Sports");

        // Write file
        XLSX.writeFile(workbook, "Sports.xlsx");
    };


    return (
        <div>
            <TableOption
                data={data}
                columns={columns}
                filterOptions={options}
                additionalFilterOptions={schoolnameoption}
                scholarshipoption={[]}
                Button={
                    <button onClick={downloadExcel} className="btn btn-primary">
                        Download Excel
                    </button>

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
            <CustomModal
                show={showPrintModalachivements}
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

export default Sporttable;
