// components/manage/Clusteradd.tsx
"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { clusterdata, MissionShikari, Schooldata, StudentData, TblHostel } from "../type";
import { formatDate } from "@/lib/utils";
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
import { validateClusterName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import Loader from "@/common/Loader ";
import Image from "next/image";
import Link from "next/link";
import Tablemission from "../table/Tablemission";

type Props = {
    initialClusterData: clusterdata[];
    Schooldata: Schooldata[];
    TblHostel: TblHostel[];
    MissionShikari: MissionShikari[];
    StudentData: StudentData[];
};

const MissionPeak = ({ initialClusterData, Schooldata, TblHostel, MissionShikari, StudentData }: Props) => {
    const t = useTranslations("missionsikhri");

    const [showPrintModal, setShowPrintModal] = useState(false);
    const [clusterName, setClusterName] = useState("");
    const [error, setError] = useState<string>("");
    const [isLoading, setIsLoading] = useState(false);
    const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
    const [isResponsive, setIsResponsive] = useState<boolean>(false);

    const [clusterData, setClusterData] =
        useState<MissionShikari[]>(MissionShikari); // State for cluster data
    const confirm = createConfirmation(ConfirmationDialog);
    const [designation, setDesignation] = useState("");
    const [studentname, setStudentName] = useState("");
    const [SchoolHostelType, setSchoolostelType] = useState("");
    const [SchoolHostelName, setSchoolHostelName] = useState("");
    const [Subject, setSubject] = useState("");
    const [TestDate, setTestDate] = useState("");
    const [Totalmarks, setTotalmarks] = useState("");
    const [obtainmarks, setObtainMarks] = useState("");
    const [Percentage, setPercentage] = useState("");
    const [adharcard, setadharcard] = useState("");
    const [parentsnumber, setParentsnumber] = useState("");
    const [imgupload, setimgupload] = React.useState<File | null>(null);
    const [imagePreview, setImagePreview] = React.useState<string>("");

    const schoolmap = Schooldata.reduce((acc, school: Schooldata) => {
        acc[school.school_id] = school.school_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);
    const hostelnamemao = TblHostel.reduce((acc, school: TblHostel) => {
        acc[school.hostel_id] = school.hostel_name; // Assuming taluka has id and name properties
        return acc;
    }, {} as Record<number, string>);


    const data = clusterData
        .map((cluster) => ({
            id: cluster.id,
            designation: cluster.designation,
            studentname: cluster.studentname,
            schoolhostelid: cluster.schoolhostelname,
            schoolhostelname: cluster.schoolhosteltype == "वसती गृह" ? hostelnamemao[cluster.schoolhostelname as any] : schoolmap[cluster.schoolhostelname as any],
            schoolhosteltype: cluster.schoolhosteltype == "Govt" ? "शासकीय" : cluster.schoolhosteltype == "Aided" ? "अनुदानित" : cluster.schoolhosteltype,
            subject: cluster.subject,
            testdate: cluster.testdate,
            totalmarks: cluster.totalmarks,
            obtainmarks: cluster.obtainmarks,
            percentage: cluster.percentage,
            aadharnumber: cluster.aadharcard,
            parentsnumber: cluster.parentsnumber,
            imgupload: cluster.imgupload,

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
            accessorKey: "aadharnumber",
            header: `${t("aadharcard")}`,
        },
        {
            accessorKey: "parentsnumber",
            header: `${t("parentsnum")}`,
        },
        {
            accessorKey: "imgupload",
            header: `${t("photo")}`,
            cell: ({ row }: any) => {
                const photoSrc =
                    row.original.imgupload &&
                        (row.original.imgupload.startsWith("http") || row.original.imgupload.startsWith("/"))
                        ? row.original.imgupload
                        : row.original.imgupload
                            ? `/${row.original.imgupload}`
                            : "/default-image.jpg"; // Provide a fallback image
                return (
                    <div style={{ textAlign: "center" }}>
                        <Image
                            src={photoSrc}
                            alt={t("img")}
                            style={{ objectFit: "cover" }}
                            height={100} // Adjust size as needed
                            width={100}
                        />
                        <br />
                        <Link href={photoSrc} target="_blank" rel="noopener noreferrer">
                            view
                        </Link>
                    </div>
                );
            },
        },
        {
            accessorKey: "designation",
            header: `${t("Designation")}`,
        },

        {
            accessorKey: "studentname", // Use a new accessor for the serial number
            header: `${t("StudentName")}`, // Header for the serial number
            cell: ({ row }: any) => (
                <div style={{ textTransform: 'uppercase' }}>
                    {row.original.studentname} {/* Display the index + 1 for serial number */}
                </div>

            ),
        },


        {
            accessorKey: "schoolhostelname",
            header: `${t("SchoolHostelName")}`,
        },
        {
            accessorKey: "schoolhosteltype",
            header: `${t("SchoolHostelType")}`,
        },
        {
            accessorKey: "subject",
            header: `${t("Subject")}`,
        },
        {
            accessorKey: "testdate",
            header: `${t("TestDate")}`,
        },
        {
            accessorKey: "totalmarks",
            header: `${t("Totalmarks")}`,
        },
        {
            accessorKey: "obtainmarks",
            header: `${t("ObtainMarks")}`,
        },
        {
            accessorKey: "percentage",
            header: `${t("Percentage")}`,
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
                        {t("editsubmit")}
                    </button>
                    <button
                        className={`btn btn-sm ${"btn-danger"
                            } ms-5`}
                        onClick={() =>
                            handleDeactivate(row.original.id)
                        }
                    >
                        <KTIcon iconName={"status"} className="fs-6" iconType="solid" />

                        {t("Deactive")}

                    </button>
                </div>
            ),
        },
    ];

    useEffect(() => {
        const handleResize = () => {
            setIsResponsive(window.innerWidth < 768); // Adjust threshold as needed
        };

        window.addEventListener("resize", handleResize);
        handleResize(); // Check on mount

        return () => {
            window.removeEventListener("resize", handleResize);
        };
    }, []);
    useEffect(() => {
        if (Totalmarks !== "" && obtainmarks !== "") {
            const total = parseFloat(Totalmarks);
            const obtained = parseFloat(obtainmarks);

            if (total > 0 && obtained >= 0) {
                const percent = (obtained / total) * 100;
                // setPercentage(percent as any);
                setPercentage(percent.toFixed(2) + "%");
            } else {
                setPercentage("");
            }
        } else {
            setPercentage("");
        }
    }, [Totalmarks, obtainmarks]);
    const handleDeactivate = async (clusterId: any) => {
        const confirmMessage =
            "Are you sure you want to Delete this Mission Sikhri ?";
        const confirmed = await confirm({ confirmation: confirmMessage });
        if (confirmed) {
            try {
                const response = await fetch(`/api/missionsikhari/delete/${clusterId}`, {
                    method: "DELETE",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        status: clusterId === "Active" ? "Deactive" : "Active",
                    }),
                });

                if (response.ok) {
                    // Update local state without page reload
                    setClusterData(prevData =>
                        prevData.filter(cluster => cluster.id !== clusterId)
                    );
                    toast.success(
                        `
                      Mission Sikhri  Delete successfully!`
                    );
                } else {
                    toast.error("Failed to change the Mission Sikhri status.");
                }
            } catch (error) {
                console.error("Error changing the Mission Sikhri status:", error);
                toast.error("An unexpected error occurred.");
            }
        }
    };

    // start student data filter
    const adhardesignation = MissionShikari
        .filter((data) => data.aadharcard === adharcard)
        .sort((a, b) => b.id - a.id) // Sort by id in descending order
        .slice(0, 1) // Get the last id entry
        .map((data) => data.designation);

    const adharimg = MissionShikari
        .filter((data) => data.aadharcard === adharcard)
        .sort((a, b) => b.id - a.id) // Sort by id in descending order
        .slice(0, 1) // Get the last id entry
        .map((data) => data.imgupload);


    const adharcontact = MissionShikari
        .filter((data) => data.aadharcard === adharcard)
        .sort((a, b) => b.id - a.id) // Sort by id in descending order
        .slice(0, 1) // Get the last id entry
        .map((data) => data.parentsnumber);

    const adhardataname = StudentData.filter((data) => data.aadhaar == adharcard && data.aadhaar !== "").map((data) => data.full_name)
    const adhardatanamemission = MissionShikari.filter((data) => data.aadharcard == adharcard && data.aadharcard !== "").map((data) => data.studentname)

    const adhardataimg = StudentData.filter((data) => data.aadhaar == adharcard && data.aadhaar !== "").map((data) => data.profile_photo)
    const adhardataschool = StudentData.filter((data) => data.aadhaar == adharcard && data.aadhaar !== "").map((data) => data.school_id)


    const adhardataimgmissionsikri = MissionShikari.filter((data) => data.aadharcard == adharcard && data.aadharcard !== "").map((data) => data.imgupload)
    const adhardataschoolmisisonsikri = MissionShikari.filter((data) => data.aadharcard == adharcard && data.aadharcard !== "").map((data) => data.schoolhostelname)
    const adhardatahostelnamemisisonsikri = MissionShikari.filter((data) => data.aadharcard == adharcard && data.aadharcard !== "").map((data) => data.schoolhosteltype)


    const finelhosteldata = TblHostel.filter((data) => data.hostel_id == adhardataschoolmisisonsikri as any).map((data) => data.hostel_name)
   

    const adhardataschooltype = Schooldata.filter((data) => data.school_id == adhardataschool as any).map((data) => data)
    const adhardataschooltypemisison = Schooldata.filter((data) => data.school_id == adhardataschoolmisisonsikri as any).map((data) => data)
    // schooltypedata
    const schooldatatype = adhardataschooltype.map((data) => data.school_type)
    const schooldatatypemission = adhardataschooltypemisison.map((data) => data.school_type)

    const schooldataname = adhardataschooltype.map((data) => data.school_name)
    const schooldatanamemission = adhardataschooltypemisison.map((data) => data.school_id)


    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        // Create FormData to handle both file and form data
        const formData = new FormData();
        formData.append("designation", designation as any == "" ? adhardesignation : designation as any);
        formData.append("studentname", studentname as any !== "" ? studentname : adhardataname.length == 0 ? adhardatanamemission : adhardataname as any);

        formData.append("schoolhosteltype", SchoolHostelType as any !== "" ? SchoolHostelType : schooldatatype.length == 0 ? schooldatatypemission : schooldatatype as any);
        formData.append("schoolhostelname", SchoolHostelName as any !== "" ? SchoolHostelName : schooldataname.length == 0 ? schooldatanamemission : schooldataname as any);
        formData.append("subject", Subject);
        formData.append("testdate", TestDate);
        formData.append("totalmarks", Totalmarks);
        formData.append("obtainmarks", obtainmarks);
        formData.append("percentage", Percentage);
        formData.append("aadharcard", adharcard);
        formData.append("parentsnumber", parentsnumber == "" ? adharcontact : parentsnumber as any);

        // Add the image file to the form data if there's an image to upload
        if (imgupload) {
            formData.append("imgupload", imgupload);
        }

        setIsLoading(true); // Start loading

        try {
            // Determine if this is an insert or update operation
            const method = updateClusterId ? "PATCH" : "POST";
            const url = updateClusterId
                ? `/api/missionsikhari/update`
                : `/api/missionsikhari/insert`;
            // If updating, include the cluster ID
            if (updateClusterId) {
                formData.append("id", updateClusterId.toString());
            }

            // Send the form data to the backend
            const response = await fetch(url, {
                method,
                body: formData, // Use FormData instead of JSON string
            });

            if (response.ok) {
                const createdData = await response.json();

                if (!updateClusterId) {
                    // If inserting a new entry, update the state with the new data
                    setClusterData((prevData) => [...prevData, createdData]);
                    toast.success("Mission Sikhri inserted successfully!");
                } else {
                    // If updating an existing entry, update the specific item in the state
                    setClusterData((prevData: any) =>
                        prevData.map((cluster: any) =>
                            cluster.id === updateClusterId
                                ? { ...cluster, ...createdData }
                                : cluster
                        )
                    );
                    toast.success("Mission Sikhri updated successfully!");
                }

                // Reset form and close modal after successful submission
                resetform();
                handleClosePrint();
            } else {
                // Handle errors from the server
                toast.error(
                    `Failed to ${updateClusterId ? "update" : "insert"} Mission Sikhri.`
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

        setUpdateClusterId(cluster.id);
        setDesignation(cluster.designation);
        setStudentName(cluster.studentname);
        setDesignation(cluster.designation);
        setSchoolHostelName(cluster.schoolhostelid);
        setSchoolostelType(cluster.schoolhosteltype);
        setSubject(cluster.subject);
        setTestDate(cluster.testdate);
        setTotalmarks(cluster.totalmarks);
        setObtainMarks(cluster.obtainmarks);
        setPercentage(cluster.percentage);
        setadharcard(cluster.aadharnumber);
        setParentsnumber(cluster.parentsnumber);
        setImagePreview(cluster.imgupload);
        handleShowPrint();
    };

    const resetform = () => {
        // setUpdateClusterId();
        setDesignation("");
        setStudentName("");
        setDesignation("");
        setSchoolHostelName("");
        setSchoolostelType("");
        setSubject("");
        setTestDate("");
        setTotalmarks("");
        setObtainMarks("");
        setPercentage("");
        setadharcard("");
        setParentsnumber("");
        setImagePreview("");
    }
    const handleShowPrint = () => setShowPrintModal(true);

    const handleClosePrint = () => {
        setShowPrintModal(false);
        setClusterName("");
        setError("");
        resetform();
        setUpdateClusterId(null); // Reset update ID when closing
    };


    const handleImageChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        const file = (e.target as HTMLInputElement).files?.[0]; // Type assertion to HTMLInputElement
        if (file) {
            setimgupload(file); // Store the actual file object
            setImagePreview(URL.createObjectURL(file)); // Create a preview URL
        }
    };

    let options;
    if (SchoolHostelType === "वसती गृह") {
        options = TblHostel.map((yojna) => ({
            value: yojna.hostel_type,
            label: yojna.hostel_type,
        }));
    } else {
        if (schooldataname.length === 0) {
            options = Schooldata.filter((data) => data.school_type === SchoolHostelType)
                .map((school) => ({
                    value: school.school_name,
                    label: school.school_name,
                }));
        } else {
            options = Schooldata.map((school) => ({
                value: school.school_name,
                label: school.school_name,
            }));
        }
    }

    return (
        <div>
            <Tablemission
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
                        {t("submit")}
                    </Button>
                }
            />

            <CustomModal
                show={showPrintModal}
                size="xl"
                handleClose={handleClosePrint}
                handleSubmit={handleSubmit}
                imagepriview={
                    adharimg[0] === null && (
                        <>
                            <img
                                src={`${adharimg}`}
                                alt="Preview"
                                style={{
                                    width: "150px", // Set a fixed width for the circular effect
                                    height: "150px", // Set a fixed height equal to width
                                    borderRadius: "5%", // Make the image circular
                                    objectFit: "cover", // Ensure the image covers the circular area
                                    overflow: "hidden", // Hide overflow to keep the circle shape
                                }}
                            />

                        </>
                    )
                }
                title={updateClusterId ? `${t('title')}` : `${t('title')}`}
                formData={{
                    fields: [
                        {
                            label: `${t('aadharcard')}`,
                            value: adharcard,
                            type: "text",
                            className: isResponsive ? 'col-12' : 'col-4',
                            placeholder: `${t('aadharcard')}`,
                            required: true,
                            onChange: (e: any) => {
                                // Ensure that only digits are allowed and limit to 11 digits
                                const inputValue = e.target.value;
                                if (/^\d*$/.test(inputValue) && inputValue.length <= 12) {
                                    setadharcard(inputValue);
                                }
                            },
                        },

                        {
                            label: `${t('parentsnum')}`,
                            value: adharcontact.length == 0 ? parentsnumber : adharcontact,
                            type: "text",
                            className: isResponsive ? 'col-12' : 'col-4',
                            placeholder: `${t('parentsnum')}`,
                            required: true,

                            onChange: (e: any) => {
                                // Ensure that only digits are allowed and limit to 11 digits
                                const inputValue = e.target.value;
                                if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                                    setParentsnumber(inputValue);
                                }
                            },
                        },

                        {
                            label: `${t('photo')}`,
                            value: "", // The value for file input is always empty (HTML behavior)
                            type: "file",
                            className: isResponsive ? 'col-12' : 'col-4',
                            placeholder: `${t('photo')}`,
                            onChange: handleImageChange, // Handle image change here
                        },

                        {
                            label: `${t('Designation')}`,
                            value: adhardesignation.length == 0 ? designation : adhardesignation, // Default value when updating
                            onChange: (e: any) => setDesignation(e.target.value),
                            type: "select",
                            className: isResponsive ? 'col-12' : 'col-2',
                            options: [
                                {
                                    label: "Mr",
                                    value: "Mr",
                                },
                                { label: "Miss", value: "Miss" },

                            ],
                            placeholder: `${t('Designation')}`, // Optional placeholder for select input
                        },

                        {
                            label: `${t('StudentName')}`,
                            value: adhardataname.length !== 0 ? adhardataname : adhardatanamemission.length == 0 ? studentname : adhardatanamemission,
                            type: "text",
                            className: isResponsive ? 'col-12' : 'col-4',
                            placeholder: `${t('StudentName')}`,
                            required: true,
                            onChange: (e: any) => setStudentName(e.target.value),
                        },

                        {
                            label: `${t('SchoolHostelType')}`,
                            value: schooldatatype.length !== 0 ? schooldatatype : schooldatatypemission.length == 0 ? SchoolHostelType : adhardatahostelnamemisisonsikri,

                            onChange: (e: any) => setSchoolostelType(e.target.value),
                            type: "select",
                            className: isResponsive ? 'col-12' : 'col-2',
                            options: [

                                {
                                    label: "शासकीय",
                                    value: "Govt",
                                },
                                { label: "अनुदानित", value: "Aided" },
                                { label: "एकलव्य", value: "एकलव्य" },
                                { label: "वसती गृह", value: "वसती गृह" },
                                { label: "इतर", value: "इतर" },

                            ],
                            placeholder: `${t('SchoolHostelType')}`, // Optional placeholder for select input
                        },

                        {
                            label: `${t('SchoolHostelName')}`,
                            value: adhardatahostelnamemisisonsikri == "वसती गृह" as any ? finelhosteldata : schooldataname.length !== 0 ? schooldataname : schooldatanamemission.length == 0 ? SchoolHostelName : schooldatanamemission,
                            type: adhardatahostelnamemisisonsikri == "वसती गृह" as any ? "text" : "select",
                            options: SchoolHostelType == "वसती गृह"
                                ? [
                                    ...TblHostel.map((yojna) => ({
                                        value: yojna.hostel_id,
                                        label: yojna.hostel_name,
                                    })),
                                    {
                                        value: 'other',
                                        label: "Other",
                                    },
                                ]
                                : schooldataname.length == 0 && schooldatanamemission.length == 0
                                    ? [
                                        ...Schooldata.filter((data) => data.school_type === SchoolHostelType)
                                            .map((school) => ({
                                                value: school.school_id,
                                                label: school.school_name,
                                            })),
                                        {
                                            value: 'other',
                                            label: "Other",
                                        },
                                    ]
                                    : [
                                        ...Schooldata.map((school) => ({
                                            value: school.school_id,
                                            label: school.school_name,
                                        })),
                                        {
                                            value: 'other',
                                            label: "Other",
                                        },
                                    ],
                            className: isResponsive ? 'col-12' : 'col-4',
                            placeholder: `${t('SchoolHostelName')}`,
                            required: true,
                            onChange: (e: any) => setSchoolHostelName(e.target.value),
                        },


                        {
                            label: `${t('Subject')}`,
                            value: Subject,
                            onChange: (e: any) => setSubject(e.target.value),
                            type: "select",
                            className: isResponsive ? 'col-12' : 'col-4',
                            options: [
                                {
                                    label: "All",
                                    value: "All",
                                },
                                {
                                    label: "Chemistry",
                                    value: "Chemistry",
                                },
                                { label: "Physics", value: "Physics" },
                                { label: "Biology", value: "Biology" },
                                { label: "Mathematics", value: "Mathematics" },

                            ],
                            placeholder: `${t('Subject')}`,
                        },

                        {
                            label: `${t('TestDate')}`,
                            value: TestDate,
                            type: "date",

                            className: isResponsive ? 'col-12' : 'col-2',
                            placeholder: `${t('TestDate')}`,
                            required: true,
                            onChange: (e: any) => setTestDate(e.target.value),
                        },
                        {
                            label: `${t('Totalmarks')}`,
                            value: Totalmarks,
                            type: "text",
                            className: isResponsive ? 'col-12' : 'col-2',
                            placeholder: `${t('Totalmarks')}`,
                            required: true,
                            onChange: (e: any) => setTotalmarks(e.target.value),
                        },
                        {
                            label: `${t('ObtainMarks')}`,
                            value: obtainmarks,
                            type: "text",
                            className: isResponsive ? 'col-12' : 'col-2',
                            placeholder: `${t('ObtainMarks')}`,
                            required: true,
                            onChange: (e: any) => setObtainMarks(e.target.value),
                        },
                        {
                            label: `${t('Percentage')}`,
                            value: Percentage,
                            type: "textwithoutval",
                            disabled: "true",
                            className: isResponsive ? 'col-12' : 'col-2',
                            placeholder: `${t('Percentage')}`,
                            // required: true,
                            onChange: (e: any) => setPercentage(e.target.value),
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

export default MissionPeak;
