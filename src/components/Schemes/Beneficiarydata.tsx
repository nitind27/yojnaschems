// components/manage/Clusteradd.tsx
"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Bank, Categorys, grampanchayat, SubCategory, talukasdata, Tblbankmaster, TblBeneficiary, TblCaste, TblEvaluation, TblMembers, tblparivahan, TblParivahanBeneficiary, TblUsers, TblYojanaType, Villages, YojanaMaster, YojanaYear } from "../type";
import { useRouter } from 'next/navigation';
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validatecategoryName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { formatDate } from "@/lib/utils";
import Addmembers from "./Addmembers";
import { diskStorage } from "multer";
import { usePathname } from "next/navigation";
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
    membersadd: TblMembers[];
    Parivahantbl: tblparivahan[];
    Bankmasterdata: Tblbankmaster[];
    tbluserdata: TblUsers[];
    parivahanbeneficiary: TblParivahanBeneficiary[];
    yojnaid: any;
    tblevaluation: TblEvaluation[];
};

const
    Beneficiarydata = ({ initialcategoryData, YojnaYear, Bankdata, category, beneficiary, yojnatype, yojnamaster, talukas, grampanchayat, Villages, castdata, membersadd, Bankmasterdata, Parivahantbl, tbluserdata, parivahanbeneficiary, yojnaid, tblevaluation }: Props) => {
        const t = useTranslations("Beneficrydatas");
        const t1 = useTranslations("beneficiary");
        console.log("tblevaluation", tblevaluation.filter((data) => data.yojana_id == yojnaid && data.parivahan_id == 124))
        const router = useRouter();
        const pathname = usePathname(); // Gets the current URL pathname
        const pathSegments = pathname.split("/").filter(Boolean); // ['en', 'yojna', 'schemes', 'beneficiary', 'beneficiryidwise', '66']
        const filteredPath = pathSegments.slice(1, 5).join("/"); // 'yojna/schemes/beneficiary'

        const [showPrintModal, setShowPrintModal] = useState(false);
        const [showPrintModalvi, setShowPrintModalvi] = useState(false);
        const [storedatabenef, setStoredatabenef] = useState("");

        const [showPrintModalgp, setShowPrintModalgp] = useState(false);
        const [townName, setTownName] = useState("");
        const [nameMarathi, setNameMarathi] = useState("");
        const [nameEnglish, setNamenglish] = useState("");
        const [population, setPopulation] = useState<number | string>("");
        const [showPrintModalMembers, setShowPrintModalMembers] = useState(false);
        const [showNumberMembers, setShowNumberMembers] = useState(0);
        const [showBachatNameMembers, setShowBachatnameMembers] = useState("");
        const [categoryName, setCategoryName] = useState("");
        const [subcategoryName, setSubCategoryName] = useState("");
        const [yojnayear, setYojnaYear] = useState("");
        const [yojnatyp, setYojnatype] = useState("");
        const [yojnaname, setYojnaName] = useState("");
        const [dist, setDist] = useState("");
        const [town, setTown] = useState("");
        const [mahasulgaav, setMahsulgaav] = useState("");
        const [bankname, setBankname] = useState("");
        const [ifccode, setIFCcode] = useState("");
        const [accountno, setAccountno] = useState("");
        const [amount, setAmount] = useState("");
        const [surname, setSurname] = useState("");
        const [firstname, setFistname] = useState("");
        const [parentsname, setParentsname] = useState("");
        const [organizationname, setorganizationname] = useState("");
        const [Commencementdate, setCommencementdate] = useState("");
        const [cast, setcast] = useState("");
        const [beneficiariestype, setbeneficiariestype] = useState("");
        const [rationcardnumber, setrationcardnumber] = useState("");
        const [aadharcardnumber, setaddharcardnumber] = useState("");
        const [mobilenumber, setmobilenumber] = useState("");
        const [savinggroupname, setsavinggroupname] = useState("");
        const [Registrationerti, setRegistrationerti] = useState("");
        const [numberofmember, setnumberofmember] = useState("");
        const [fourty, setfourty] = useState("");
        const [sixty, setsixty] = useState("");
        const [hundred, sethundred] = useState("");
        const [error, setError] = useState<string>("");
        const [isLoading, setIsLoading] = useState(false);
        const [isLoadinggp, setIsLoadinggp] = useState(false);
        const [isLoadingvi, setIsLoadingvi] = useState(false);
        const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
        const [clusterData, setClusterData] =
            useState<tblparivahan[]>(Parivahantbl); // State for Beneficiary data


        const [beneficiarydata, setbeneficiarydata] =
            useState<TblBeneficiary[]>(beneficiary);
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
        const tblusername = tbluserdata.reduce((acc, gp: TblUsers) => {
            acc[gp.user_id] = gp.name; // Assuming taluka has id and name properties
            return acc;
        }, {} as Record<number, string>);

        const calculateTotalEstimatedAmount = (category: { amount: string }[]) => {
            return category.reduce((total, item) => total + parseFloat(item.amount), 0);
        };
        const village = Villages.reduce((acc, gp: Villages) => {
            acc[gp.id] = gp.name; // Assuming taluka has id and name properties
            return acc;
        }, {} as Record<number, string>);

        const sumcategory = initialcategoryData
            .filter((category: SubCategory) => String(category.category_id) === categoryName && category.status === "Active")
            .map((category: SubCategory) => ({
                amount: category.amount // Ensure this is an object with an 'amount' property
            }));

        const totalEstimatedAmount = calculateTotalEstimatedAmount(sumcategory);
        const handlepassdatamembers = (number: any) => {
            setShowPrintModalMembers(prev => !prev)
            setShowNumberMembers(number.beneficiary_id)
            setShowBachatnameMembers(number.gat_name)
        }


        const data = clusterData
            .map((beneficiary) => {
                const parivahanCount = parivahanbeneficiary.filter(
                    (data) => data.yojana_id == yojnaid && data.sup_id == beneficiary.sup_id
                ).length;
                const parivahanCountsss = parivahanbeneficiary.filter(
                    (data) => data.yojana_id == yojnaid && data.sup_id == beneficiary.sup_id
                ).map((data) => data.beneficiary_id);

                const bendata = parivahanCountsss.map((data: any) => data as any)

                const evaluationCount = tblevaluation.filter(
                    (data) => data.yojana_id == yojnaid && data.parivahan_id == beneficiary.parivahan_id
                ).length;

                return {
                    beneficiary_id: beneficiary.beneficiary_id,
                    sup_id: tblusername[beneficiary.sup_id],
                    parivahanbeneficiary: parivahanCount,
                    col3: evaluationCount,
                    col4: parivahanCount - evaluationCount, // Difference calculation
                };
            })
            .reverse();

        ;


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
                accessorKey: "sup_id",
                header: `${t("Col1")}`,
            },
            {
                accessorKey: "serial_number",
                header: () => (
                    <div style={{ fontWeight: 'bold', padding: '5px' }}>
                        {t("Col2")}
                    </div>
                ),
                cell: ({ row }: any) => (
                    <div className="cursor-pointer" onClick={() => handleShowPrintbenefdata(row.original.beneficiary_id)}>
                        {row.original.parivahanbeneficiary}
                    </div>
                ),
            },

            {
                accessorKey: "col3",
                header: `${t("Col3")}`,
            },


            {
                accessorKey: "serial_number",
                header: () => (
                    <div style={{ fontWeight: 'bold', padding: '5px' }}>
                        {t("Col4")}
                    </div>
                ),
                cell: ({ row }: any) => (
                    <div className="cursor-pointer" onClick={() => handleShowPrintbenefdata(row.original.beneficiary_id)}>
                        {row.original.col4}
                    </div>
                ),
            },
            {
                accessorKey: "serial_number",
                header: () => (
                    <div style={{ fontWeight: 'bold', padding: '5px' }}>
                        {t("Col5")}
                    </div>
                ),
                cell: ({ row }: any) => (
                    <div className="cursor-pointer" onClick={() => handleShowPrintbenefdata(row.original.beneficiary_id)}>
                        {row.original.col4}
                    </div>
                ),
            },



        ];

        const individualBeneficiaryIds = storedatabenef.split(',');

        const dataaa = beneficiarydata
            .filter(beneficiary =>
                individualBeneficiaryIds.includes(String(beneficiary.beneficiary_id))
            ).map((beneficiary) => ({
                beneficiary_id: beneficiary.beneficiary_id,
                category_id: categorydata[beneficiary.category_id],
                categoryid: beneficiary.category_id,
                sub_category_id: subcat[beneficiary.sub_category_id],
                subcategoryid: beneficiary.sub_category_id,
                yojana_year_id: yojna_year[beneficiary.yojana_year_id],
                yojanayearid: beneficiary.yojana_year_id,
                yojana_type: yojnatypes[beneficiary.yojana_type as any],
                yojanatype: beneficiary.yojana_type,
                yojana_id: yojnamastername[beneficiary.yojana_id],
                yojanaid: beneficiary.yojana_id,
                taluka_id: talukaMap[beneficiary.taluka_id],
                talukaid: beneficiary.taluka_id,
                gp_id: gpmap[beneficiary.gp_id],
                gpid: beneficiary.gp_id,
                village_id: village[beneficiary.village_id],
                villageid: beneficiary.village_id,
                surname: beneficiary.surname,
                firstname: beneficiary.firstname,
                middlename: beneficiary.middlename,
                fullname: `${beneficiary.surname} ${beneficiary.firstname} ${beneficiary.middlename}`, // Better formatting
                gat_name: beneficiary.gat_name,
                gat_certificate: beneficiary.gat_certificate,
                member: beneficiary.member,
                caste_id: beneficiary.caste_id,
                casteid: usercastdata[beneficiary.caste_id],
                beneficiary_type: beneficiary.beneficiary_type,
                rashion_no: beneficiary.rashion_no,
                aadhar: beneficiary.aadhar,
                mobile: beneficiary.mobile,
                bank_name: beneficiary.bank_name,
                ifsc: beneficiary.ifsc,
                ac_no: beneficiary.ac_no,
                tot_finance: beneficiary.tot_finance,
                amount_paid: beneficiary.amount_paid,
                fourty: beneficiary.fourty === '1' ? "Yes" : "No",
                sixty: beneficiary.sixty === '1' ? "Yes" : "No",
                hundred: beneficiary.hundred === '1' ? "Yes" : "No",
                status: beneficiary.status,
                date_ins: beneficiary.date_ins,
                date_update: beneficiary.date_update,
                organization: beneficiary.organization,
                work_order_date:
                    typeof beneficiary.work_order_date === "string"
                        ? formatDate(beneficiary.work_order_date)
                        : formatDate(beneficiary.work_order_date as any),
            }))
            .reverse();

        const columnsss = [
            {
                accessorKey: "serial_number",
                header: () => (
                    <div style={{ fontWeight: 'bold', padding: '5px' }}>
                        {t1("SrNo")}
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
                header: `${t1("categoryname")}`,
            },
            {
                accessorKey: "sub_category_id",
                header: `${t1("subcategoryname")}`,
            },
            {
                accessorKey: "yojana_year_id",
                header: `${t1("year")}`,
            },
            {
                accessorKey: "yojana_type",
                header: `${t1("yojnatype")}`,
            },
            {
                accessorKey: "yojana_id",
                header: `${t1("yojnaname")}`,
            },
            {
                accessorKey: "taluka_id",
                header: `${t1("dist")}`,
            },
            {
                accessorKey: "gp_id",
                header: `${t1("GramPanchayat")}`,
            },
            {
                accessorKey: "village_id",
                header: `${t1("Village")}`,
            },

            {
                accessorKey: "gat_name",
                header: `${t1("bachtgat")}`,
            },
            {
                accessorKey: "gat_certificate",
                header: `${t1("registerdcert")}`,
            },
            {
                accessorKey: "member",
                header: `${t1("members")}`,
            },

            {
                accessorKey: "organization", // Organization managing the scheme
                header: `${t1("Organization")}`
            },
            {
                accessorKey: "work_order_date", // Date related to work orders issued
                header: `${t1("Commencementorderdate")}`
            },
            {
                accessorKey: "fullname",
                header: `${t1("FullName")}`,
            },



            {
                accessorKey: "casteid",
                header: `${t1("Cast")}`,
            },
            {
                accessorKey: "beneficiary_type",
                header: `${t1("beneficiarytype")}`,
            },
            {
                accessorKey: "rashion_no",
                header: `${t1("Registrationcard")}`,
            },
            {
                accessorKey: "aadhar",
                header: `${t1("aadharcard")}`,
            },
            {
                accessorKey: "mobile",
                header: `${t1("Contact")}`,
            },
            {
                accessorKey: "bank_name",
                header: `${t1("BankName")}`,
            },
            {
                accessorKey: "ifsc",
                header: `${t1("IFSCCode")}`,
            },
            {
                accessorKey: "ac_no",
                header: `${t1("AccountNo")}`,
            },
            {
                accessorKey: "tot_finance",
                header: `${t1("TotalFinanceAllocated")}`,
            },
            {
                accessorKey: "amount_paid",
                header: `${t1("AmountPaid")}`,
            },
            {
                accessorKey: "fourty", // Assuming this is a status indicator
                header: `${t1("Eligible40")}`,
            },
            {
                accessorKey: "sixty", // Assuming this is a status indicator
                header: `${t1("Eligible60")}`,
            },
            {
                accessorKey: "hundred", // Assuming this is a status indicator
                header: `${t1("Eligible100")}`,
            },
            {
                accessorKey: "status", // Current status of the beneficiary
                header: `${t1("Status")}`,
            },


        ];

        const handleDeactivate = async (category_id: any, currentStatus: any) => {
            const confirmMessage =
                currentStatus == "Active"
                    ? "Are you sure you want to deactivate this Beneficiary?"
                    : "Are you sure you want to activate this Beneficiary?";
            const confirmed = await confirm({ confirmation: confirmMessage });
            if (confirmed) {
                try {
                    const response = await fetch(`/api/benefucuary/delete/${category_id}`, {
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
                                cluster.beneficiary_id == category_id
                                    ? {
                                        ...cluster,
                                        status: currentStatus == "Active" ? "Deactive" : "Active",
                                    }
                                    : cluster
                            )
                        );
                        toast.success(
                            `Beneficiary ${currentStatus == "Active" ? "deactivated" : "activated"
                            } successfully!`
                        );
                    } else {
                        toast.error("Failed to change the Beneficiary status.");
                    }
                } catch (error) {
                    console.error("Error changing the Beneficiary status:", error);
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
                    ? `/api/benefucuary/update`
                    : `/api/benefucuary/insert`;

                // Prepare the request body
                const workofdate = new Date();

                const requestBody = {
                    category_id: categoryName,
                    sub_category_id: subcategoryName,
                    yojana_year_id: yojnayear,
                    yojana_type: yojnatyp,
                    yojana_id: yojnaname,
                    taluka_id: dist,
                    gp_id: town,
                    village_id: mahasulgaav,
                    surname: surname,
                    firstname: firstname,
                    middlename: parentsname,
                    fullname: surname + firstname + parentsname,
                    gat_name: organizationname,
                    gat_certificate: Registrationerti,
                    member: numberofmember,
                    caste_id: cast,
                    beneficiary_type: beneficiariestype,
                    rashion_no: rationcardnumber,
                    aadhar: aadharcardnumber,
                    mobile: mobilenumber,
                    bank_name: bankname,
                    ifsc: ifccode,
                    ac_no: accountno,
                    tot_finance: amount,
                    amount_paid: amount,
                    fourty: fourty,
                    sixty: sixty,
                    hundred: hundred,
                    organization: amount,
                    work_order_date: workofdate.toISOString(),
                    ...(updateClusterId && { beneficiary_id: updateClusterId }),
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
                                cluster.sup_id == updateClusterId
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

        const handleSubmitgpvi = async (event: React.FormEvent) => {
            event.preventDefault();


            setIsLoadinggp(true); // Start loading

            try {
                const method = "POST";
                const url =
                    `/api/grampanchayat/insert`;

                const bodyData = {
                    // id: updateTownId ? updateTownId.toString() : undefined,
                    name: town,
                    name_marathi: nameMarathi,
                    taluka_id: dist,
                    population: '0',
                };

                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyData),
                });

                if (response.ok) {
                    toast.success(
                        `Grampanchayat inserted successfully!`
                    );

                    router.refresh();
                    handleClosePrintgpvi();
                } else {
                    const data = await response.json();

                    toast.error(
                        `Failed to insert Grampanchayat: ${data.error
                        }`
                    );
                }
            } catch (error) {
                console.error("Error during operation:", error);
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoadinggp(false); // End loading
            }
        };


        const handleSubmitvi = async (event: React.FormEvent) => {
            event.preventDefault();

            setIsLoadingvi(true); // Start loading

            try {
                const method = "POST";
                const url = `/api/mahasulgaav/insert`;

                // Prepare data for submission
                const bodyData = {

                    taluka_id: dist,
                    gp_id: town,
                    name: mahasulgaav,
                    name_marathi: nameMarathi,
                    total_population: 0,
                    trible_population: 0,
                    arthik_maryada: 0,
                    village_type: "",
                };

                const response = await fetch(url, {
                    method,
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify(bodyData),
                });

                if (response.ok) {

                    //   if (!updateTownId) {
                    //     // If inserting a new entry
                    //     const newVillage = await response.json(); // Assuming API returns the new village object

                    //     setMahsulgaav((prevData) => [...prevData, newVillage]);
                    //   } else {
                    //     // If updating an existing entry
                    //     setMahsulgaav((prevData: any) =>
                    //       prevData.map((gp: any) =>
                    //         gp.id === updateTownId ? { ...gp, ...bodyData } : gp
                    //       )
                    //     );
                    //   }

                    toast.success(
                        `Village inserted successfully!`
                    );
                    router.refresh();
                    handleClosePrintgpvi();
                } else {
                    const data = await response.json();
                    toast.error(
                        `Failed to insert Village: ${data.error}`
                    );
                }
            } catch (error) {
                console.error("Error during operation:", error);
                toast.error("An unexpected error occurred.");
            } finally {
                setIsLoadingvi(false); // End loading
            }

        };

        const handleEdit = (benefit: any) => {
            setUpdateClusterId(benefit.beneficiary_id); // Set ID for updating
            setCategoryName(benefit.categoryid);
            setSubCategoryName(benefit.subcategoryid);
            setYojnaYear(benefit.yojanayearid);
            setYojnatype(benefit.yojanatype);
            setYojnaName(benefit.yojanaid);
            setDist(benefit.talukaid);
            setTown(benefit.gpid);
            setMahsulgaav(benefit.villageid);
            setBankname(benefit.bank_name);
            setIFCcode(benefit.ifsc);
            setAccountno(benefit.ac_no);
            setAmount(benefit.amount_paid);
            setSurname(benefit.surname);
            setFistname(benefit.firstname);
            setParentsname(benefit.middlename);
            setorganizationname(benefit.organization);
            setCommencementdate(benefit.work_order_date);
            setcast(benefit.caste_id);
            setbeneficiariestype(benefit.beneficiary_type);
            setrationcardnumber(benefit.rashion_no);
            setaddharcardnumber(benefit.aadhar);
            setmobilenumber(benefit.mobile);
            setsavinggroupname(benefit.gat_name);
            setRegistrationerti(benefit.gat_certificate);
            setnumberofmember(benefit.member);
            setfourty(benefit.fourty);
            setsixty(benefit.sixty);
            sethundred(benefit.hundred);
            handleShowPrint(); // Open modal for editing

        };


        const reset = () => {
            setUpdateClusterId(null); // Set ID for updating
            setCategoryName("");
            setSubCategoryName("");
            setYojnaYear("");
            setYojnatype("");
            setYojnaName("");
            setDist("");
            setTown("");
            setMahsulgaav("");
            setBankname("");
            setIFCcode("");
            setAccountno("");
            setAmount("");
            setSurname("");
            setFistname("");
            setParentsname("");
            setorganizationname("");
            setCommencementdate("");
            setcast("");
            setbeneficiariestype("");
            setrationcardnumber("");
            setaddharcardnumber("");
            setmobilenumber("");
            setsavinggroupname("");
            setRegistrationerti("");
            setnumberofmember("");
            setfourty("");
            setsixty("");
            sethundred("");
        }

        const resetgpvi = () => {
            setUpdateClusterId(null); // Set ID for updating
            setCategoryName("");
            // setTown("");
            setNameMarathi("");
            // setTown("");
            setMahsulgaav("");
            // setDist("");
            setPopulation("");
        }
        const handleShowPrint = () => setShowPrintModal(true);
        const handleShowPrintgp = () => setShowPrintModalgp(true);
        const handleShowPrintvi = () => setShowPrintModalvi(true);
        const handleShowPrintbenefdata = (row: any) => (setStoredatabenef(row), setShowPrintModalvi(true));

        const handleClosePrint = () => {
            setShowPrintModal(false);
            setShowPrintModalgp(false);
            setShowPrintModalvi(false);

            setCategoryName("");
            setError("");
            reset();
            setUpdateClusterId(null); // Reset update ID when closing
        };


        const handleClosePrintgpvi = () => {

            setShowPrintModalgp(false);
            setShowPrintModalvi(false);

            setCategoryName("");
            setError("");
            resetgpvi();
            setUpdateClusterId(null); // Reset update ID when closing
        };

        const optionsdata = [
            {
                label: "अपंग",
                value: "अपंग",
            },
            { label: "B.P.L", value: "B.P.L" },
            { label: "वन पट्टेधारक", value: "वन पट्टेधारक" },
            { label: "वन पट्टेधारक", value: "वन पट्टेधारक" },
            { label: "विधवा", value: "विधवा" },
            { label: "परितक्त्या", value: "परितक्त्या" },
            { label: "इतर", value: "इतर" },
        ]

        const formFields = [
            {
                label: `${t('categoryname')}`,
                value: categoryName,
                required: true,
                onChange: (e: any) => setCategoryName(e.target.value),
                type: "select",
                options: category.map((category: Categorys) => ({
                    value: category.category_id,
                    label: category.category_name,
                })),
                placeholder: `${t('categoryname')}`, // Optional placeholder for select input
            },
            {
                label: `${t('subcategoryname')}`, // Label for the select input
                value: subcategoryName, // Use state for the selected subcategory
                onChange: (e: any) => setSubCategoryName(e.target.value), // Function to update selected subcategory
                type: "select", // Type of input
                options: [
                    ...initialcategoryData
                        .filter((category: SubCategory) => String(category.category_id) == categoryName && category.status == "Active")
                        .map((category: SubCategory) => ({
                            value: category.sub_category_id, // Unique identifier for subcategories
                            label: `${category.sub_category_name} ( ${category.amount} )`, // Display name for the 
                        })),
                    {
                        value: 'Oth', // Unique value for the create option
                        label: 'Other', // Label for the create option, assuming you have a translation key for it
                    },
                    {
                        value: 'Other', // Unique value for the create option
                        label: "Total" + " " + totalEstimatedAmount, // Label for the create option, assuming you have a translation key for it
                    },
                ],
                placeholder: `${t('subcategoryname')}`, // Optional placeholder for select input
            }
            ,

            {
                label: `${t('year')}`,
                value: yojnayear,
                onChange: (e: any) => setYojnaYear(e.target.value),
                type: "select",
                options: YojnaYear.map((year: YojanaYear) => ({
                    value: year.yojana_year_id,
                    label: year.yojana_year,
                })),
                placeholder: `${t("year")}`, // Optional placeholder for select input
            },
            {
                label: `${t('yojnatype')}`,
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
                label: `${t('yojnaname')}`,
                value: yojnaname,
                onChange: (e: any) => setYojnaName(e.target.value),
                type: "select",
                className: 'col-12',
                options: yojnamaster
                    .filter((type) =>
                        String(type.yojana_year_id) == yojnayear &&
                        String(type.yojana_type) == yojnatyp &&
                        String(type.category_id) == categoryName &&
                        String(type.sub_category_id) == subcategoryName
                    )
                    .map((yojna) => ({
                        value: yojna.yojana_year_id,
                        label: yojna.yojana_name,
                    })),
                placeholder: `${t("yojnaname")}`, // Optional placeholder for select input
            },
            {
                label: `${t('dist')}`,
                value: dist,
                onChange: (e: any) => setDist(e.target.value),
                type: "select",
                options: talukas.map((taluka: any) => ({
                    value: taluka.id,
                    label: taluka.name,
                })),
                placeholder: `${t("dist")}`, // Optional placeholder for select input
            },
            {
                label: `${t('GramPanchayat')}`,
                value: town, // Ensure this uses townName

                type: "inputselectgp",
                placeholder: `${t('GramPanchayat')}`,
                onChange: (e: any) => setTown(e.target.value), // Keep this to set townName

                options: grampanchayat
                    .filter((type) => String(type.taluka_id) == dist)
                    .map((yojna, index, array) => ({
                        value: yojna.id,
                        label: `${array.length - index}) ${yojna.name_marathi}`, // Reverse the order of display without altering the index
                    })).reverse(),
            }
            ,


            ...(yojnatyp !== "3" ? [
                {
                    label: `${t('Village')}`,
                    value: mahasulgaav,
                    type: "inputselectvi",
                    placeholder: `${t('Village')}`,
                    onChange: (e: any) => setMahsulgaav(e.target.value),
                    options: Villages
                        .filter((type) =>
                            String(type.taluka_id) == dist &&
                            String(type.gp_id) == town

                        )
                        .map((yojna) => ({
                            value: yojna.id,
                            label: yojna.name_marathi,
                        })).reverse(),
                },
            ] : []),


            {
                label: `${t('BankName')}`,
                value: bankname || "",
                type: "select",
                options: Bankmasterdata
                    .filter((type) =>
                        String(type.talukaid) == dist

                    ).map((yojna) => ({
                        value: yojna.bank_name,
                        label: yojna.bank_name,
                    })),
                required: true,
                placeholder: `${t("BankName")}`,
                onChange: (e: any) => setBankname(e.target.value),
            },

            {
                label: `${t('IFSCCode')}`,
                value: Bankmasterdata.filter((f) => f.bank_name == bankname && f.talukaid == dist as any).map((f) => f.ifsc_code),
                type: "text",
                disabled: true,
                required: true,
                placeholder: `${t("IFSCCode")}`,
                onChange: (e: any) => setIFCcode(e.target.value),
            },
            {
                label: `${t('AccountNo')}`,
                value: accountno || "",
                type: "text",
                required: true,
                placeholder: `${t("AccountNo")}`,
                onChange: (e: any) => setAccountno(e.target.value),
            },
            {
                label: `${t('AmountPaid')}`,
                value: amount || "",
                required: true,
                type: "text",

                placeholder: `${t("AmountPaid")}`,
                onChange: (e: any) => setAmount(e.target.value),
            },

        ];


        const formFieldsGp = [
            {
                label: `${t("dist")}`,
                value: dist,
                disabled: dist !== "",
                className: "col-12",
                onChange: (e: any) => setDist(e.target.value),
                type: "select",
                options: talukas.map((taluka: any) => ({
                    value: taluka.id,
                    label: taluka.name,
                })),
                placeholder: `${t("dist")}`, // Optional placeholder for select input
            },
            {
                label: `${t("englishname")}`,
                value: town,
                required: true,
                className: "col-12",
                onChange: (e: any) => setTown(e.target.value),
                type: "text",
                placeholder: `${t("englishname")}`,

            },
            {
                label: `${t("marathiname")}`,
                value: nameMarathi,
                required: true,
                className: "col-12",
                type: "text",
                placeholder: `${t("marathiname")}`,
                onChange: (e: any) => setNameMarathi(e.target.value),
            },

        ]

        const formFieldsVi = [
            {
                label: `${t('GramPanchayat')}`,
                value: town, // Ensure this uses townName
                disabled: town !== "",
                className: "col-12",
                readonly: true,
                type: "inputselectgp",
                placeholder: `${t('GramPanchayat')}`,
                onChange: (e: any) => setTown(e.target.value), // Keep this to set townName

                options: grampanchayat
                    .filter((type) =>
                        String(type.taluka_id) == dist

                    )
                    .map((yojna, index) => ({
                        value: yojna.id,
                        label: `${index + 1}) ${yojna.name_marathi}`,
                    })),
            },

            {
                label: `${t("dist")}`,
                value: dist,
                disabled: dist !== "",
                className: "col-12",
                onChange: (e: any) => setDist(e.target.value),
                type: "select",
                options: talukas.map((taluka: any) => ({
                    value: taluka.id,
                    label: taluka.name,
                })),
                placeholder: `${t("dist")}`, // Optional placeholder for select input
            },
            {
                label: `${t("englishname")}`,
                value: mahasulgaav,
                required: true,
                className: "col-12",
                type: "text",
                placeholder: `${t("englishname")}`,
                onChange: (e: any) => setMahsulgaav(e.target.value),
            },

            {
                label: `${t("marathiname")}`,
                value: nameMarathi,
                required: true,
                className: "col-12",
                type: "text",
                placeholder: `${t("marathiname")}`,
                onChange: (e: any) => setNameMarathi(e.target.value),
            },


        ]
        if (yojnatyp == "1") {

            const surnameField = {
                label: `${t('surname')}`,
                value: surname || "",
                required: true,
                type: "text",
                placeholder: `${t('surname')}`,
                onChange: (e: any) => setSurname(e.target.value),
            };
            formFields.splice(8, 0, surnameField);
            const firstnameField = {
                label: `${t('firstname')}`,
                value: firstname || "",
                type: "text",
                required: true,
                placeholder: `${t('firstname')}`,
                onChange: (e: any) => setFistname(e.target.value),
            };
            formFields.splice(9, 0, firstnameField);
            const parentsnameField = {
                label: `${t('parentsname')}`,
                value: parentsname || "",
                type: "text",
                required: true,
                placeholder: `${t('parentsname')}`,
                onChange: (e: any) => setParentsname(e.target.value),
            };
            formFields.splice(10, 0, parentsnameField);
            // Insert at index 2, shifting existing elements.


            const castField = {
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
            };
            formFields.splice(11, 0, castField);


            const beneficiarytypeField = {
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
            };
            formFields.splice(12, 0, beneficiarytypeField);



            const aadharcardField = {
                label: `${t('aadharcard')}`,
                value: aadharcardnumber || "",
                type: "text",
                required: true,
                className: "col-4",
                placeholder: `${t('aadharcard')}`,
                // onChange: (e: any) => setaddharcardnumber(e.target.value),
                onChange: (e: any) => {
                    // Ensure that only digits are allowed and limit to 11 digits
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue) && inputValue.length <= 12) {
                        setaddharcardnumber(inputValue);
                    }
                },
            };
            formFields.splice(13, 0, aadharcardField as any);



            const ContactField = {
                label: `${t('Contact')}`,
                value: mobilenumber || "",
                required: true,
                type: "text",
                className: "col-4",
                placeholder: `${t('Contact')}`,
                // onChange: (e: any) => setmobilenumber(e.target.value),

                onChange: (e: any) => {
                    // Ensure that only digits are allowed and limit to 11 digits
                    const inputValue = e.target.value;
                    if (/^\d*$/.test(inputValue) && inputValue.length <= 12) {
                        setmobilenumber(inputValue);
                    }
                },
            };
            formFields.splice(14, 0, ContactField as any);




            const RegistrationcardField = {
                label: `${t('Registrationcard')}`,
                value: rationcardnumber || "",
                type: "text",
                className: "col-4",
                required: true,
                placeholder: `${t('Registrationcard')}`,
                onChange: (e: any) => setrationcardnumber(e.target.value),
            };
            formFields.splice(15, 0, RegistrationcardField as any);


            formFields.push({


                label: `${t('Eligible40')}`,
                value: fourty || "",
                required: false,

                type: "checkbox",
                placeholder: `40%`,
                onChange: (e: any) => setfourty(e.target.value),
            },
                {
                    label: `${t('Eligible60')}`,
                    value: sixty || "",
                    type: "checkbox",
                    required: false,
                    placeholder: `60%`,
                    onChange: (e: any) => setsixty(e.target.value),
                },
                {
                    label: `${t('Eligible100')}`,
                    value: hundred || "",
                    type: "checkbox",
                    required: false,
                    placeholder: `100%`,
                    onChange: (e: any) => sethundred(e.target.value),
                },);

        } else if (yojnatyp == "2") {
            formFields.push({
                label: `${t('bachtgat')}`,
                value: savinggroupname || "",
                type: "text",
                required: true,
                placeholder: `${t('bachtgat')}`,
                onChange: (e: any) => setsavinggroupname(e.target.value),
            },
                {
                    label: `${t('registerdcert')}`,
                    value: Registrationerti || "",
                    type: "text",
                    required: true,
                    placeholder: `${t('registerdcert')}`,
                    onChange: (e: any) => setRegistrationerti(e.target.value),
                },
                {
                    label: `${t('members')}`,
                    value: numberofmember || "",
                    type: "text",
                    required: true,
                    placeholder: `${t('members')}`,
                    onChange: (e: any) => setnumberofmember(e.target.value),
                },
                // {
                //     label: `${t('sansthaname')}`,
                //     value: organizationname || "",
                //     type: "text",
                //     required: true,
                //     placeholder: `${t('sansthaname')}`,
                //     onChange: (e: any) => setorganizationname(e.target.value),
                // },
                // {
                //     label: `${t('Commencementorderdate')}`,
                //     value: Commencementdate || "",
                //     type: "date",
                //     required: true,
                //     placeholder: `${t('Commencementorderdate')}`,
                //     onChange: (e: any) => setCommencementdate(e.target.value),
                // },
                {
                    label: `${t('Eligible40')}`,
                    value: fourty || "",
                    type: "checkbox",
                    required: false,
                    placeholder: `40%`,
                    onChange: (e: any) => setfourty(e.target.value),
                },
                {
                    label: `${t('Eligible60')}`,
                    value: sixty || "",
                    type: "checkbox",
                    required: false,


                    placeholder: `60%`,
                    onChange: (e: any) => setsixty(e.target.value),
                },

                {
                    label: `${t('Eligible100')}`,
                    value: hundred || "",
                    type: "checkbox", required: false,
                    placeholder: `100%`,
                    onChange: (e: any) => sethundred(e.target.value),
                },

            );
        }
        else if (yojnatyp == "3") {
            formFields.push({
                label: `${t('sansthaname')}`,
                value: organizationname || "",
                type: "text",
                required: true,
                placeholder: `${t('sansthaname')}`,
                onChange: (e: any) => setorganizationname(e.target.value),
            },);
            formFields.push({
                label: `${t('Commencementorderdate')}`,
                value: Commencementdate || "",
                type: "date",
                required: true,
                placeholder: `${t('Commencementorderdate')}`,
                onChange: (e: any) => setCommencementdate(e.target.value),
            },);
            formFields.push(
                {
                    label: `${t('Eligible40')}`,
                    value: (fourty == "true" ? 1 : fourty || "").toString(),
                    type: "text",
                    placeholder: `%`,
                    required: false,
                    onChange: (e: any) => setfourty(e.target.value),
                },
                {
                    label: `${t('Eligible60')}`,
                    value: (sixty == "true" ? 1 : sixty || "").toString(),
                    type: "text",
                    placeholder: `%`,
                    required: false,
                    onChange: (e: any) => setsixty(e.target.value),
                },
                {
                    label: `${t('Eligible100')}`,
                    value: (hundred == "true" ? 1 : hundred || "").toString(),
                    type: "text",
                    required: false,
                    placeholder: `%`,
                    onChange: (e: any) => sethundred(e.target.value),
                },
            );

        }

        return (
            <div>

                <Addmembers initialcategoryData={initialcategoryData} YojnaYear={[]} Bankdata={[]} category={[]} beneficiary={[]} yojnatype={yojnatype} yojnamaster={[]} talukas={[]} grampanchayat={[]} Villages={[]} castdata={castdata} showPrintModalMembers={showPrintModalMembers} showNumberMembers={showNumberMembers} membersadd={membersadd} showBachatNameMembers={showBachatNameMembers} />

                <Table
                    data={data}
                    columns={columns}
                    Button={filteredPath !== "yojna/schemes/beneficiary/beneficiryidwise" &&
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
                            {t("addbenef")}
                        </Button>
                    }
                />

                <CustomModal
                    show={showPrintModal}
                    handleClose={handleClosePrint}

                    btttongroupgp={

                        <Button variant="primary" id="button-addon2" size="sm" onClick={handleShowPrintgp}>
                            +
                        </Button>
                    }
                    btttongroupgpvi={

                        <Button variant="primary" id="button-addon2" size="sm" onClick={handleShowPrintvi}>
                            +
                        </Button>
                    }

                    handleSubmit={handleSubmit}
                    size={"xl"}
                    title={updateClusterId ? `${t("updatepage")}` : `${t("insertpage")}`}
                    formData={{
                        fields: formFields as any,
                        error: "",
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
                    show={showPrintModalgp}
                    handleClose={handleClosePrintgpvi}


                    handleSubmit={handleSubmitgpvi}
                    size={"ml"}
                    title={updateClusterId ? `${t("GramPanchayat")}` : `${t("GramPanchayat")}`}
                    formData={{
                        fields: formFieldsGp as any,
                        error: "",
                    }}

                    submitButtonLabel={
                        updateClusterId
                            ? isLoadinggp
                                ? "Submitting..."
                                : t("editsubmit")
                            : isLoadinggp
                                ? "Submitting..."
                                : t("submit")
                    }
                    disabledButton={isLoadinggp}
                />

                <CustomModal
                    show={showPrintModalvi}
                    handleClose={handleClosePrintgpvi}
                    filterdata={
                        <Tablefilter
                            data={dataaa}
                            columns={columnsss}

                        />
                    }
                    handleSubmit={handleSubmitvi}
                    size={"xl"}
                    title={updateClusterId ? `${t1("title")}` : `${t1("title")}`}
                    formData={{
                        fields: [],
                        error: "",
                    }}
                    submitButtonLabel={[]
                    }
                    disabledButton={isLoading}
                />
            </div>
        );
    };

export default Beneficiarydata;
