// components/manage/Clusteradd.tsx
"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import {
  Bank,
  Categorys,
  Representative,
  SubCategory,
  WorkMaster,
  WorkMasterDemo,
  YojanaYear,
} from "../type";

import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { toast } from "react-toastify";
// import { validatecategoryName } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";
import { formatDate } from "@/lib/utils";
import Link from "next/link";
import PathHandler from "@/common/PathHandler";

type Props = {
  initialcategoryData: SubCategory[];
  YojnaYear: YojanaYear[];
  Bankdata: Bank[];
  category: Categorys[];
  Workmasters: WorkMasterDemo[];
  reprenstive: Representative[];
};

const Generateform = ({
  YojnaYear,
  Bankdata,
  category,
  Workmasters,
  reprenstive,
}: Props) => {
  const t = useTranslations("workmaster");
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [categoryName, setCategoryName] = useState("");
  const [subcategoryName, setSubCategoryName] = useState("");
  const [yojnayear, setYojnaYear] = useState("");

  const workofdates = new Date();

  // Format the date to "07 Jan 2025"
  const options = { day: "2-digit", month: "short", year: "numeric" };
  const formattedDate = workofdates.toLocaleDateString("en-GB", options as any);

  const [gendate, setGendate] = useState(workofdates);
  const [amount, setAmount] = useState("");
  const [randomNumber, setRandomNumber] = useState(null);

  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [updateClusterId, setUpdateClusterId] = useState<number | null>(null);
  const [workmasterdata, setWorkmaster] =
    useState<WorkMasterDemo[]>(Workmasters); // State for Work Master data
  const confirm = createConfirmation(ConfirmationDialog);
  const reprenstives = reprenstive.reduce((acc, year: Representative) => {
    acc[year.id as any] = year.name; // Assuming taluka has id and name properties
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

  const data = workmasterdata
    .map((workmaster) => ({
      id: workmaster.id,
      taluka_id: workmaster.taluka_id,
      gp_id: workmaster.gp_id,
      village_id: workmaster.village_id,
      facility_id: workmaster.facility_id,
      representative_id: workmaster.representative_id,
      representativeid: reprenstives[workmaster.representative_id as any],
      representative_name: workmaster.representative_name,
      name: workmaster.name,
      estimated_amount: workmaster.estimated_amount,
      tantrik_manyata_amount: workmaster.tantrik_manyata_amount,
      photo: workmaster.photo,
      prashashakiya_manyata: workmaster.prashashakiya_manyata,
      prashashakiya_manyata_no: workmaster.prashashakiya_manyata_no,
      prashashakiya_manyata_date: workmaster.prashashakiya_manyata_date,
      prashashakiya_manyata_amount: workmaster.prashashakiya_manyata_amount,
      latitude: workmaster.latitude,
      longitude: workmaster.longitude,
      address: workmaster.address,
      status: workmaster.status,
      created_at: workmaster.created_at,
      updated_at: workmaster.updated_at,
      estimatedtotalamount: workmaster.estimatedtotalamount,
      number_work: workmaster.number_work,
      generatednumber: workmaster.generatednumber,
      type: workmaster.type,
      // genratedworkdate: workmaster.genratedworkdate,

      genratedworkdate:
        typeof workmaster.genratedworkdate === "string"
          ? formatDate(workmaster.genratedworkdate)
          : formatDate(workmaster.genratedworkdate as any),
      genratedworkdateISO:
        workmaster.genratedworkdate
    }))
    .reverse(); // Reverse the order to show the last added items first

  const columns = [
    {
      accessorKey: "serial_number",
      header: () => (
        <div style={{ fontWeight: "bold", padding: "5px" }}>{t("SrNo")}</div>
      ),
      cell: ({ row }: any) => <div>{row.index + 1}</div>,
    },
    {
      accessorKey: "generatednumber",
      header: `${t("Code")}`,
    },
    {
      accessorKey: "genratedworkdate",
      header: `${t("gendate")}`,
    },

    {
      accessorKey: "representativeid",
      header: `${t("Representativepost")}`,
    },

    {
      accessorKey: "representative_name",
      header: `${t("RepresentativeName")}`,
    },

    {
      accessorKey: "estimatedtotalamount",
      header: `${t("estimateamounttotal")}`,
    },
    {
      accessorKey: "number_work",
      header: `${t("numberofwork")}`,
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
            disabled={row.original.status !== "Active" && true}
          >
            {" "}
            <KTIcon iconName={"pencil"} className="fs-6" iconType="solid" />
            {t("edit")}
          </button>
          <button
            className={`btn btn-sm ${row.original.status === "Active" ? "btn-danger" : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === "Active"
              ? `${t("Deactive")}`
              : `${t("Active")}`}
          </button>
          {row.original.status !== "Active" ? (
            <button
              className={`btn btn-sm btn-success ms-5
                          `}
              disabled={row.original.status !== "Active" && true}
            >
              <KTIcon
                iconName={"calendar-edit"}
                className="fs-6"
                iconType="solid"
              />
              View + Add
            </button>
          ) : (
            <PathHandler>
              <Link
                href={`/en/workmaster/work/${row.original.generatednumber}`}
              >
                <button
                  className={`btn btn-sm btn-success ms-5
  `}
                  disabled={row.original.status !== "Active" && true}
                >
                  <KTIcon
                    iconName={"calendar-edit"}
                    className="fs-6"
                    iconType="solid"
                  />
                  {Workmasters.length == row.original.number_work
                    ? "View"
                    : "View + Add"}
                </button>
              </Link>
            </PathHandler>
          )}
        </div>
      ),
    },
  ];

  const handleDeactivate = async (category_id: any, currentStatus: any) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this workmaster ?"
        : "Are you sure you want to activate this workmaster?";
    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const response = await fetch(`/api/workshow/delete/${category_id}`, {
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
          setWorkmaster((prevData) =>
            prevData.map((cluster) =>
              cluster.id === category_id
                ? {
                  ...cluster,
                  status: currentStatus == "Active" ? "Deactive" : "Active",
                }
                : cluster
            )
          );
          toast.success(
            `Work Master ${currentStatus === "Active" ? "deactivated" : "activated"
            } successfully!`
          );
        } else {
          toast.error("Failed to change the Work Master status.");
        }
      } catch (error) {
        console.error("Error changing the Work Master status:", error);
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
        ? `/api/workmaster/update`
        : `/api/workmaster/insert`;

      // Prepare the request body
      const workofdate = new Date();
      const requestBody = {
        representative_id: categoryName,
        representative_name: subcategoryName,
        number_work: yojnayear,
        genratedworkdate: gendate,
        estimatedtotalamount: amount,
        generatednumber: randomNumber,

        ...(updateClusterId && { id: updateClusterId }),
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
          setWorkmaster((prevData: any) =>
            prevData.map((cluster: any) =>
              cluster.id == updateClusterId
                ? {
                  ...cluster,
                  representative_id: categoryName,
                  representative_name: subcategoryName,
                  number_work: yojnayear,
                  genratedworkdate: gendate,
                  estimatedtotalamount: amount,
                  generatednumber: randomNumber,
                }
                : cluster
            )
          );
          toast.success("Work Master updated successfully!");
        } else {
          const createdData = await response.json();
          setWorkmaster((prevData) => [...prevData, createdData]);
          toast.success("Work Master inserted successfully!");
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

    setUpdateClusterId(cluster.id); // Set ID for updating
    setCategoryName(cluster.representative_id); // Set current name for editing
    setSubCategoryName(cluster.representative_name);
    setAmount(cluster.estimatedtotalamount);
    setYojnaYear(cluster.number_work);
    setGendate(cluster.genratedworkdateISO);
    handleShowPrint(); // Open modal for editing
  };

  const handleShowPrint = () => setShowPrintModal(true);
  const reset = () => {
    setCategoryName("");
    setSubCategoryName("");
    setYojnaYear("");
    setGendate(workofdates);
    setError("");
    setAmount("");
  };
  const handleClosePrint = () => {
    reset();
    setShowPrintModal(false);
    setCategoryName("");
    setError("");
    setUpdateClusterId(null); // Reset update ID when closing
  };

  const generateRandomNumber = () => {
    const number = Math.floor(Math.random() * 90000) + 10000;
    setRandomNumber(number as any);
  };
  useEffect(() => {
    generateRandomNumber();
  }, []); // Empty dependency array means this runs once on mount

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
            {t("addbenef")}
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
              label: `${t("Representativepost")}`,
              value: categoryName,
              onChange: (e: any) => setCategoryName(e.target.value),
              type: "select",
              options: reprenstive.map((category: Representative) => ({
                value: category.id,
                label: category.name,
              })),
              placeholder: `${t("Representativepost")}`, // Optional placeholder for select input
            },
            {
              label: `${t("RepresentativeName")}`,
              value: subcategoryName,
              required: true,
              type: "text",

              placeholder: `${t("RepresentativeName")}`,

              onChange: (e: any) => setSubCategoryName(e.target.value),
            },
            {
              label: `${t("numberofwork")}`,
              value: yojnayear,
              required: true,
              type: "text",
              placeholder: `${t("numberofwork")}`,

              onChange: (e: any) => setYojnaYear(e.target.value),
            },
            {
              label: `${t("gendate")}`,
              value: gendate,
              type: "date",
              required: true,

              placeholder: `${t("gendate")}`,

              onChange: (e: any) => setGendate(e.target.value),
            },

            {
              label: `${t("estimateamount")}`,
              value: amount,
              required: true,
              type: "text",

              placeholder: `${t("estimateamount")}`,

              onChange: (e: any) => setAmount(e.target.value),
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

export default Generateform;
