// components/manage/Clusteradd.tsx
"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Bank, Categorys, grampanchayat, SubCategory, talukasdata, TblBeneficiary, TblCaste, TblMembers, TblYojanaType, Villages, YojanaMaster, YojanaYear } from "../type";

import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validatecategoryName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { formatDate } from "@/lib/utils";
import Tablefilter from "../table/Tablefilter";

type Props = {
    initialcategoryData: SubCategory[];
    YojnaYear: YojanaYear[];
    Bankdata: Bank[];
    category: Categorys[];
    beneficiary: TblBeneficiary[];
    yojnatype: TblYojanaType[];
    yojnamaster: YojanaMaster[];
    talukas: talukasdata[];
    grampanchayat: grampanchayat[];
    Villages: Villages[];
    castdata: TblCaste[];
    showPrintModalMembers: any;
    showNumberMembers: any;
    showBachatNameMembers: any;
    membersadd: TblMembers[];
};

const Addmembers = ({ initialcategoryData, YojnaYear, Bankdata, category, beneficiary, yojnatype, yojnamaster, talukas, grampanchayat, Villages, castdata, showPrintModalMembers, showNumberMembers, membersadd,showBachatNameMembers }: Props) => {
    const t = useTranslations("beneficiary");
    const [showPrintModal, setShowPrintModal] = useState(false);
    const [surname, setSurname] = useState("");
    const [firstname, setFistname] = useState("");
    const [parentsname, setParentsname] = useState("");
    const [designation, setDesignation] = useState("");
    const [cast, setcast] = useState("");
    const [beneficiariestype, setbeneficiariestype] = useState("");
    const [rationcardnumber, setrationcardnumber] = useState("");
    const [aadharcardnumber, setaddharcardnumber] = useState("");
    const [mobilenumber, setmobilenumber] = useState("");
    const [numberofmember, setnumberofmember] = useState("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [clusterData, setClusterData] =
        useState<TblMembers[]>(membersadd); // State for Beneficiary data
    const confirm = createConfirmation(ConfirmationDialog);
    const yojna_year = YojnaYear.reduce((acc, year: YojanaYear) => {
        acc[year.yojana_year_id] = year.yojana_year; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const usercastdata = castdata.reduce((acc, year: TblCaste) => {
        acc[year.caste_id] = year.caste_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const categorydata = category.reduce((acc, year: Categorys) => {
        acc[year.category_id] = year.category_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const subcat = initialcategoryData.reduce((acc, subcat: SubCategory) => {
        acc[subcat.sub_category_id] = subcat.sub_category_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const yojnatypes = yojnatype.reduce((acc, year: TblYojanaType) => {
        acc[year.yojana_type_id] = year.yojana_type; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const yojnamastername = yojnamaster.reduce((acc, year: YojanaMaster) => {
        acc[year.yojana_id] = year.yojana_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const talukaMap = talukas.reduce((acc, taluka: any) => {
        acc[taluka.id] = taluka.name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const gpmap = grampanchayat.reduce((acc, gp: any) => {
        acc[gp.id] = gp.name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const village = Villages.reduce((acc, gp: Villages) => {
        acc[gp.id] = gp.name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);

    const calculateTotalEstimatedAmount = (category: { amount: string }[]) => {
        return category.reduce((total, item) => total + parseFloat(item.amount), 0);
    };


    useEffect(() => {
        showNumberMembers !== 0 &&
            handleShowPrint();
    }, [showPrintModalMembers])
    const data = clusterData.filter((member) => member.beneficiary_id == showNumberMembers)
        .map((beneficiary) => ({
            member_id: beneficiary.member_id,
            beneficiary_id: beneficiary.beneficiary_id,

            // Addmember: beneficiary.yojana_type == '2' ? "Nitin" : "",

            surname: beneficiary.surname,
            aadhar_no: beneficiary.aadhar_no,
            mobile_no: beneficiary.mobile_no,
            ration_no: beneficiary.ration_no,
            designation: beneficiary.designation,
            firstname: beneficiary.firstname,
            middlename: beneficiary.middlename,
            status: beneficiary.status,
            fullname: beneficiary.surname + " " + beneficiary.firstname + " " + beneficiary.middlename,
            caste_id: beneficiary.caste_id,
            casteid: usercastdata[beneficiary.caste_id],
            beneficiary_type: beneficiary.beneficiary_type,

            // work_order_date: beneficiary.work_order_date,    


        })).reverse()
        ; // Reverse the order to show the last added items first

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
            accessorKey: "fullname",
            header: `${t("FullName")}`,
        },
        {
            accessorKey: "designation",
            header: `${t("Designation")}`,
        },
        {
            accessorKey: "casteid",
            header: `${t("Cast")}`,
        },
        {
            accessorKey: "beneficiary_type",
            header: `${t("beneficiarytype")}`,
        },
        {
            accessorKey: "ration_no",
            header: `${t("Registrationcard")}`,
        },
        {
            accessorKey: "aadhar_no",
            header: `${t("aadharcard")}`,
        },
        {
            accessorKey: "mobile_no",
            header: `${t("Contact")}`,
        },
        {
            accessorKey: "status", // Current status of the beneficiary
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
                        className={`btn btn-sm ${row.original.status == "Active" ? "btn-danger" : "btn-warning"
                            } ms-5`}
                        onClick={() =>
                            handleDeactivate(row.original.member_id, row.original.status)
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
                ? "Are you sure you want to deactivate this Member?"
                : "Are you sure you want to activate this Member?";
        const confirmed = await confirm({ confirmation: confirmMessage });
        if (confirmed) {
            try {
                const response = await fetch(`/api/members/delete/${category_id}`, {
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
                            cluster.member_id == category_id
                                ? {
                                    ...cluster,
                                    status: currentStatus == "Active" ? "Deactive" : "Active",
                                }
                                : cluster
                        )
                    );
                    toast.success(
                        `Member ${currentStatus == "Active" ? "deactivated" : "activated"
                        } successfully!`
                    );
                } else {
                    toast.error("Failed to change the Member status.");
                }
            } catch (error) {
                console.error("Error changing the Member status:", error);
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
            const method = updateClusterId ? "POST" : "POST";
            const url = updateClusterId
                ? `/api/members/update`
                : `/api/members/insert`;

            // Prepare the request body
            const workofdate = new Date();

            const requestBody = {
                surname: surname,
                beneficiary_id: showNumberMembers,
                firstname: firstname,
                middlename: parentsname,
                fullname: surname + firstname + parentsname,
                designation: designation,

                caste_id: cast,
                beneficiary_type: beneficiariestype,
                ration_no: rationcardnumber,
                aadhar_no: aadharcardnumber,
                mobile_no: mobilenumber,
                // status: "Active",
                work_order_date: workofdate.toISOString(),
                ...(updateClusterId && { member_id: updateClusterId }),
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
                            cluster.member_id == updateClusterId
                                ? { ...cluster, ...requestBody as any }
                                : cluster
                        )
                    );
                    toast.success("Beneficiary updated successfully!");
                } else {
                    const createdData = await response.json();
                    setClusterData((prevData) => [...prevData, createdData]);
                    toast.success("Beneficiary inserted successfully!");
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
    const handleEdit = (benefit: any) => {
        setUpdateClusterId(benefit.member_id); // Set ID for updating
        setSurname(benefit.surname);
        setFistname(benefit.firstname);
        setParentsname(benefit.middlename);
        setcast(benefit.caste_id);
        setbeneficiariestype(benefit.beneficiary_type);
        setDesignation(benefit.designation)
        setrationcardnumber(benefit.ration_no);
        setaddharcardnumber(benefit.aadhar_no);
        setmobilenumber(benefit.mobile_no);
        setnumberofmember(benefit.member);
        handleShowPrint(); // Open modal for editing

    };


    const reset = () => {
        setUpdateClusterId(null); // Set ID for updating
        setSurname("");
        setFistname("");
        setParentsname("");
        setcast("");
        setbeneficiariestype("");
        setDesignation("");
        setrationcardnumber("");
        setaddharcardnumber("");
        setmobilenumber("");
        setnumberofmember("");
    }
    const handleShowPrint = () => setShowPrintModal(true);

    const handleClosePrint = () => {
        setShowPrintModal(false);
        setError("");
        reset();
        setUpdateClusterId(null); // Reset update ID when closing
    };
    const optionsdatajaat = [
        {
            label: "अध्यक्ष",
            value: "अध्यक्ष",
        },
        { label: "उपाध्यक्ष", value: "उपाध्यक्ष" },
        { label: "सचिव", value: "सचिव" },
        { label: "सदस्य", value: "सदस्य" },

    ]


    const optionsdata = [
        {
            label: "अपंग",
            value: "अपंग",
        },
        { label: "B.P.L", value: "B.P.L" },
        { label: "वन पट्टेधारक", value: "वन पट्टेधारक" },
        { label: "विधवा", value: "विधवा" },
        { label: "परितक्त्या", value: "परितक्त्या" },
        { label: "इतर", value: "इतर" },
    ]


    const formFields = [
        {
            label: `${t('surname')}`,
            value: surname || "",
            required: true,
            type: "text",
            placeholder: `${t('surname')}`,
            onChange: (e: any) => setSurname(e.target.value),
        }, {
            label: `${t('firstname')}`,
            value: firstname || "",
            type: "text",
            required: true,
            placeholder: `${t('firstname')}`,
            onChange: (e: any) => setFistname(e.target.value),
        }, {
            label: `${t('parentsname')}`,
            value: parentsname || "",
            type: "text",
            required: true,
            placeholder: `${t('parentsname')}`,
            onChange: (e: any) => setParentsname(e.target.value),
        }, {
            label: `${t('Designation')}`,
            value: designation || "",
            type: "select",
            required: true,
            options: optionsdatajaat.map((cast: any) => ({
                value: cast.value,
                label: cast.label,
            })),
            placeholder: `${t('beneficiarytype')}`,
            onChange: (e: any) => setDesignation(e.target.value),


        }, {
            label: `${t('Cast')}`,
            value: cast || "",
            type: "select",
            required: true,
            options: castdata.map((cast: TblCaste) => ({
                value: cast.caste_id,
                label: cast.caste_name,
            })),
            placeholder: `${t('Cast')}`,
            onChange: (e: any) => setcast(e.target.value),
        }, {
            label: `${t('beneficiarytype')}`,
            value: beneficiariestype || "",
            type: "select",
            required: true,
            options: optionsdata.map((cast: any) => ({
                value: cast.value,
                label: cast.label,
            })),
            placeholder: `${t('beneficiarytype')}`,
            onChange: (e: any) => setbeneficiariestype(e.target.value),


        }, {
            label: `${t('Registrationcard')}`,
            value: rationcardnumber || "",
            type: "text",
            required: true,
            placeholder: `${t('Registrationcard')}`,
            // onChange: (e: any) => setrationcardnumber(e.target.value),

            onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 11) {
                    setrationcardnumber(inputValue);
                }
            },
        }, {
            label: `${t('aadharcard')}`,
            value: aadharcardnumber || "",
            type: "text",
            required: true,
            placeholder: `${t('aadharcard')}`,
            // onChange: (e: any) => setaddharcardnumber(e.target.value),
            onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 12) {
                    setaddharcardnumber(inputValue);
                }
            },
        }, {
            label: `${t('Contact')}`,
            value: mobilenumber || "",
            required: true,
            type: "text",
            placeholder: `${t('Contact')}`,
            // onChange: (e: any) => setmobilenumber(e.target.value),
            onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                    setmobilenumber(inputValue);
                }
            },
        },
    ]

    return (
        <div>

            <CustomModal
                show={showPrintModal}
                titiledetails={showBachatNameMembers}
                handleClose={handleClosePrint}
                handleSubmit={handleSubmit}
                size={"xl"}
                title={updateClusterId ? `Add Member` : `Add Member`}
                formData={{
                    fields: formFields as any,
                    error: "",
                }}
                filterdata={<Tablefilter
                    data={data}
                    columns={columns}

                />
                }

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

export default Addmembers;
