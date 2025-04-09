// components/manage/Clusteradd.tsx
"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import '../../assets/parivahan.css'
import {
    Bank,
    Categorys,
    SubCategory,
    TblBeneficiary,
    TblEvaluation,
    TblEvaluationAmount,
    tblparivahan,
    TblParivahanBeneficiary,
    TblUsers,
    TblYojanaType,
    YojanaMaster,
    YojanaYear,
} from "../type";

import { Button, Form } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validateadhikanchaname } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { formatDate } from "@/lib/utils";
import Tablefilter from "../table/Tablefilter";
import { clippingParents } from "@popperjs/core";
import Custommodellable from "@/common/Custommodellable";
import ParivahanInput from "./ParivahanInput";
import { useAppContext } from "./Contaxt/AppContext";

type Props = {
    subCategory: SubCategory[];
    YojnaYear: YojanaYear[];
    Bankdata: Bank[];
    yojanaMaster: YojanaMaster[];
    category: Categorys[];
    yojnatype: TblYojanaType[];
    Parivahanbeneficiarys: TblParivahanBeneficiary[];
    Parivahantbl: tblparivahan[];
    Beneficiary: TblBeneficiary[];
    Userdata: TblUsers[];
    TblEvaluation: TblEvaluation[];
    TblEvaluationAmount: TblEvaluationAmount[];
};

const Parivahanamountadd = ({
    subCategory,
    YojnaYear,
    Bankdata,
    yojanaMaster,
    category,
    Parivahantbl,
    yojnatype,
    Parivahanbeneficiarys,
    Beneficiary,
    Userdata,
    TblEvaluation,
    TblEvaluationAmount
}: Props) => {
    const t = useTranslations("parivahan");
    const confirm = createConfirmation(ConfirmationDialog);
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [showimage, setShowimage] = useState("");
    const [OutwardNo, setOutwardNo] = useState("");
    const [Date, setDate] = useState("");
    const [Latitude, setLatitude] = useState("");
    const [Longitude, setLongitude] = useState("");
    const [Address, setAddress] = useState("");
    const [OtherRemarks, setOtherRemarks] = useState("");
    const [beneficiaryid, setBeneficiaryid] = useState("");
    const [evaluationid, setEvaluationid] = useState("");
    const [hundredPercent, setHundredPercent] = useState("");

    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [parivahandata, setparivahandata] =
        useState<TblEvaluation[]>(TblEvaluation); // State for Sub Category data
    const [TblEvaluationAmountdata, setTblEvaluationAmountdata] =
        useState<TblEvaluationAmount[]>(TblEvaluationAmount); // State for Sub Category data
    const { inputData, setInputData } = useAppContext(); // Use Context

    const yojna_year = YojnaYear.reduce((acc, year: YojanaYear) => {
        acc[year.yojana_year_id] = year.yojana_year; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const yojna_type = yojnatype.reduce((acc, year: TblYojanaType) => {
        acc[year.yojana_type_id] = year.yojana_type; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const yojnamster = yojanaMaster.reduce((acc, year: YojanaMaster) => {
        acc[year.yojana_id] = year.yojana_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const yojnamsteramount = yojanaMaster.reduce((acc, year: YojanaMaster) => {
        acc[year.yojana_id] = year.amount; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const usersdata = Userdata.reduce((acc, year: TblUsers) => {
        acc[year.user_id] = year.name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const beneficiaryname = Beneficiary.reduce((acc, year: TblBeneficiary) => {
        acc[year.beneficiary_id] = year.fullname; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const usersdataaddress = Userdata.reduce((acc, year: TblUsers) => {
        acc[year.user_id] = year.address; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);


    const [financeData, setFinanceData] = useState(
        Beneficiary.map((data: any) => ({
            beneficiary_id: data.beneficiary_id,
            tot_finance: data.tot_finance,
            fortyPercent: (data.tot_finance * 40) / 100,
            sixtyPercent: (data.tot_finance * 60) / 100,
            hundredPercent: (data.tot_finance * 100) / 100,
        }))
    );

    // Handler to update specific percentage values
    // const handleInputChange = (beneficiaryId: number, key: string, value: number) => {
    //     setFinanceData((prevData) =>
    //         prevData.map((item) =>
    //             item.beneficiary_id === beneficiaryId ? { ...item, [key]: value } : item
    //         )
    //     );
    // };

    const handleShowPrint = () => setShowPrintModal(true);
    const handleimageshow = (row: any) => {

        setShowimage(row.photo)
        setOutwardNo(row.outwardno)
        setDate(row.dateparivahan)
        setLatitude(row.lat)
        setLongitude(row.log)
        setAddress(row.parivahanadrees)
        setOtherRemarks(row.remarks)
        setShowPrintModal(true)
    }
    const handleClosePrint = () => {

        setShowPrintModal(false);

    };

    const handleSubmit = async () => {

        try {
            const method = updateClusterId ? "POST" : "POST";
            const url = updateClusterId
                ? `/api/parivahan/parivahanamountadd`
                : `/api/parivahan/parivahanamountadd`;

            // Prepare the request body
            const requestBody = {
                beneficiary_id: beneficiaryid,
                evaluation_id: evaluationid,
                amount: hundredPercent as any, // Assuming this should be converted to string too
                ...(updateClusterId && { beneficiary_id: String(updateClusterId) }),
            };


            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(requestBody),
            });




            handleClosePrint();
        }

        catch (error) {
            console.error("Error during operation:", error);
            toast.error("An unexpected error occurred.");
        }
    };
    const handleDeactivate = async (category_id: any) => {

        const confirmMessage = "Are you sure want to Add ?";
        const confirmed = await confirm({ confirmation: confirmMessage } as any);
        if (confirmed) {
            try {
                const response = await fetch(`/api/evaluationamount/updateevalutionamount/${category_id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        evaluation_status: "Received",
                    }),
                });

                if (response.ok) {
                    // Update local state without page reload
                    setparivahandata((prevData) =>
                        prevData.map((cluster) =>
                            cluster.evaluation_id == category_id
                                ? {
                                    ...cluster,
                                    evaluation_status: "Received",
                                }
                                : cluster
                        )
                    );
                    // handleSubmit()
                    toast.success(
                        ` ${"Amount Added"
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

    const data = parivahandata
        .map((parivhan) => ({
            evaluation_id: parivhan.evaluation_id,
            parivahan_id: parivhan.parivahan_id,
            outwardno: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => data.outward_no),
            dateparivahan: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => formatDate(data.parivahan_date as any)),
            parivahanadrees: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => usersdataaddress[data.sup_id]),
            parivahanoutward_no: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => data.outward_no + formatDate(data.parivahan_date as any)),
            username: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => usersdata[data.sup_id] + usersdataaddress[data.sup_id]),

            beneficiary_id: parivhan.beneficiary_id,
            photo: parivhan.photo,
            remarks: parivhan.remarks,
            other_remraks: parivhan.other_remraks,
            lat: parivhan.lat,
            log: parivhan.log,
            address: parivhan.address,
            editconditioncheckfor: TblEvaluationAmountdata.filter((data) => data.evaluation_id == parivhan.evaluation_id).map((data) => data.verification),
            // yojana_id: parivhan.yojana_id,

            yojana_year_id: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => yojna_year[data.yojana_year_id]),

            yojana_type: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => yojna_type[data.yojana_type as any]),


            yojana_id: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => yojnamster[data.yojana_id as any]),
            category_id: parivhan.category_id,
            // yojana_type: parivhan.yojana_type,
            ins_date_time: parivhan.ins_date_time,
            update_date_time: parivhan.update_date_time,
            evaluation_status: parivhan.evaluation_status,
            status: parivhan.status,
        }))
        .reverse(); // Reverse the order to show the last added items first

    // Displaying the result
    const columns = [
        {
            accessorKey: "serial_number",
            header: () => (
                <div style={{ fontWeight: "bold", padding: "5px" }}>{t("SrNo")}</div>
            ),
            cell: ({ row }: any) => <div>{row.index + 1}</div>,
        },

        {
            accessorKey: "parivahanoutward_no",
            header: `${t("parivahandate")}`,
        },
        {
            accessorKey: "username",
            header: `${t("outwardno")}`,
        },

        {
            accessorKey: "yojana_year_id",
            header: `${t("year")}`,
        },

        {
            accessorKey: "yojana_type",
            header: `${t("yojnatype")}`,
        },
        {
            accessorKey: "yojana_id",
            header: `${t("yojnaname")}`,
        },

        {
            accessorKey: "actions",
            header: `${t("beneficiary")}`,
            cell: ({ row }: any) => {
                // Move the beneficiary data filtering outside the cell function
                const beneficiaryData = Beneficiary.filter((b) => b.beneficiary_id === row.original.beneficiary_id).map((data: any) => ({
                    ...data,
                    fortyPercent: (data.tot_finance * 40) / 100,
                    sixtyPercent: (data.tot_finance * 60) / 100,
                    hundredPercent: (data.tot_finance * 100) / 100,
                }));

                return (

                    <>
                        <ParivahanInput
                            beneficiaryData={beneficiaryData}
                            row={row}
                            TblEvaluationAmount={TblEvaluationAmount}
                            TblEvaluation={TblEvaluation}
                            handleimageshow={handleimageshow}

                        />
                    </>
                );
            },
        }


    ];

    const dataItems = [
        { label: "Outward No", content: OutwardNo },
        { label: "Date", content: Date },
        { label: "Latitude", content: Latitude },
        { label: "Longitude", content: Longitude },
        { label: "Address", content: Address },
        { label: "Other Remarks", content: OtherRemarks },

    ];
    const mappedData = Object.entries(inputData).map(([key, value]: any) => {
        return {
            id: key,
            ...value
        };
    });

    // const inputmapdata = [mappedData[0]]
    const inputmapdata = mappedData.length > 0 ? [mappedData[0]] : [];

    useEffect(() => {
        if (inputmapdata.length > 0) {
            setHundredPercent(inputmapdata.map((data: any) => data.hundredPercent).join() as any)
            setEvaluationid(inputmapdata.map((data: any) => data.evaluation_id).join() as any)
            setBeneficiaryid(inputmapdata.map((data: any) => data.beneficiary_id).join() as any)
            // console.log("inputmapdata", inputmapdata.map((data: any) => data));
        } else {
            console.log("No data available");
        }
    }, [])


    return (
        <div>
            <Table
                data={data}
                columns={columns}
                Button={
                    []
                }
            />
            <Custommodellable
                show={showPrintModal}
                handleClose={handleClosePrint}
                handleSubmit={[]}
                dataItems={dataItems}
                imagepriview={<img
                    src={showimage}
                    alt="Preview"
                    style={{
                        width: "150px", // Set a fixed width for the circular effect
                        height: "150px", // Set a fixed height equal to width
                        borderRadius: "5%", // Make the image circular
                        objectFit: "cover", // Ensure the image covers the circular area
                        overflow: "hidden", // Hide overflow to keep the circle shape
                    }}
                />}
                title={`स्थळ तपासणी अहवाल`}
                formData={{
                    fields: [

                    ],
                }}

                submitButtonLabel={[]}
            // disabledButton={isLoading}
            />

        </div>
    );
};

export default Parivahanamountadd;
