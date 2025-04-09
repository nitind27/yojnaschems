// components/manage/Clusteradd.tsx
"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import '../../assets/parivahan.css'
import {
    Bank,
    Categorys,
    Padnam,
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
    Padnam: Padnam[];
};

const ParivahanTotalamount = ({
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
    TblEvaluationAmount,
    Padnam
}: Props) => {
    const t = useTranslations("parivahan");
    const confirm = createConfirmation(ConfirmationDialog);

    const [parivahandata, setparivahandata] =
        useState<TblEvaluation[]>(TblEvaluation); // State for Sub Category data

    const [parivahandatatotalamount, setparivahandatatotalamount] =
        useState<TblEvaluationAmount[]>(TblEvaluationAmount); // State for Sub Category data

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
    const Padnamdata = Padnam.reduce((acc, year: Padnam) => {
        acc[year.padnam_id] = year.padnam; // Assuming taluka has id and name properties
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
    const usersdataaddress = Userdata.reduce((acc, year: TblUsers) => {
        acc[year.user_id] = year.address; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const beneficiaryname = Beneficiary.reduce((acc, year: TblBeneficiary) => {
        acc[year.beneficiary_id] = year.fullname; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const allevaluationid = parivahandatatotalamount.map((data) => data.evaluation_id)

    const data = parivahandata.filter((data) => allevaluationid.includes(data.evaluation_id) as any)
        .map((parivhan) => ({
            evaluation_id: parivhan.evaluation_id,
            parivahan_id: parivhan.parivahan_id,
            parivahanoutward_no: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => data.outward_no + formatDate(data.parivahan_date as any)),
            username: Parivahanbeneficiarys.filter((data) => data.parivahan_id == parivhan.parivahan_id).map((data) => usersdata[data.sup_id] + data.sup_id  + usersdataaddress[data.sup_id]),

            beneficiary_id: parivhan.beneficiary_id,
            amounttotal: Beneficiary.filter((data) => data.beneficiary_id == parivhan.beneficiary_id).map((data) => data.tot_finance),
            amounttotalpending: parivahandatatotalamount.filter((data) => data.evaluation_id == parivhan.evaluation_id && data.verification == "No").map((data) => data.amount),
            amounttotalpendingdetails: parivahandatatotalamount.filter((data) => data.evaluation_id == parivhan.evaluation_id && data.verification == "No").map((data) => data.verification),
            amounttotalpendingdetailsid: parivahandatatotalamount.filter((data) => data.evaluation_id == parivhan.evaluation_id && data.verification == "No").map((data) => data.id),
            photo: parivhan.photo,
            remarks: parivhan.remarks,
            other_remraks: parivhan.other_remraks,
            lat: parivhan.lat,
            log: parivhan.log,
            address: parivhan.address,
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
            accessorKey: "amounttotal",
            header: `${t("yojnaname")}`,
        },
        {
            accessorKey: "amounttotalpending",
            header: `${t("yojnaname")}`,
        },


        {
            accessorKey: "actions",
            header: `${t("beneficiary")}`,
            cell: ({ row }: any) => (
                <div className="overflow-x-auto">
                    {row.original.amounttotalpendingdetails == "No" ?

                        <input type="checkbox" onClick={() =>
                            handleDeactivate(row.original.amounttotalpendingdetailsid)
                        } /> : <span style={{ color: "red" }}>Virified</span>
                    }

                </div>
            ),
        },

    ];

    const handleDeactivate = async (category_id: any) => {
        const confirmMessage = "Are you sure you want to activate this category?";
        const confirmed = await confirm({ confirmation: confirmMessage } as any);
        if (confirmed) {
            try {
                const response = await fetch(`/api/evaluationamount/delete/${category_id}`, {
                    method: "PATCH",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        verification: "Yes",
                    }),
                });

                if (response.ok) {
                    // Update local state without page reload
                    setparivahandatatotalamount((prevData) =>
                        prevData.map((cluster) =>
                            cluster.id == category_id
                                ? {
                                    ...cluster,
                                    verification: "Active",
                                }
                                : cluster
                        )
                    );
                    toast.success(
                        ` ${"Amount Updated"
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

    return (
        <div>
            <Table
                data={data}
                columns={columns}
                Button={
                    <Button
                        variant="primary"
                        // onClick={handleShowPrint}
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


        </div>
    );
};

export default ParivahanTotalamount;
