"use client";
import React, { useEffect, useState } from "react";
import Table from "../table/Table"; // Adjust path as necessary
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers";
import CustomModal from "@/common/CustomModal";
import { grampanchayat, talukasdata, Villages } from "../type";
import { toast } from "react-toastify";
import { validateMasulGaav } from "@/utils/Validation";
import { useTranslations } from "next-intl";

import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
  Villages: Villages[];
  talukas: talukasdata[]; // To store the fetched talukasData
  grampanchayat: grampanchayat[];
};

const Mahsulgaav = ({ Villages, talukas, grampanchayat }: Props) => {
  const t = useTranslations('MahasulGaav');
  const [isLoading, setIsLoading] = useState(false);

  const [showPrintModal, setShowPrintModal] = useState(false);
  const [townName, setTownName] = useState("");
  const [nameMarathi, setNameMarathi] = useState("");
  const [nameEnglish, setNamenglish] = useState("");
  const [talukaId, setTalukaId] = useState<number | string>("");
  const [population, setPopulation] = useState<number | string>("");
  const [triblePopulation, setTriblePopulation] = useState<number | string>("");
  const [arthikMaryada, setArthikMaryada] = useState<number | string>("");
  const [villageType, setVillageType] = useState<string>("");
  const [status, setStatus] = useState<string>("Active");
  const [error, setError] = useState<string>("");
  const [updateTownId, setUpdateTownId] = useState<number | null>(null);
  const [filteredGrampanchayat, setFilteredGrampanchayat] = useState<
    grampanchayat[]
  >([]);


  const confirm = createConfirmation(ConfirmationDialog);

  const [mahsulgaav, setMahsulgaav] = useState<Villages[]>(Villages);

  const talukaMap = talukas.reduce((acc, taluka: any) => {
    acc[taluka.id] = taluka.name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);
  const gpMap = grampanchayat.reduce((acc, gp: any) => {
    acc[gp.id] = gp.name; // Assuming taluka has id and name properties
    return acc;
  }, {} as Record<number, string>);

  const data = mahsulgaav.map((villages) => ({
    id: villages.id,
    t_id: villages.taluka_id,
    g_id: villages.gp_id,
    taluka_id: talukaMap[villages.taluka_id],
    gp_id: gpMap[villages.gp_id],
    name: villages.name,
    name_marathi: villages.name_marathi,
    total_population: villages.total_population,
    trible_population: villages.trible_population,
    arthik_maryada: villages.arthik_maryada,
    village_type: villages.village_type,
    status: villages.status,
  })).reverse();

  const columns = [
    {
      accessorKey: "serial_number", // Use a new accessor for the serial number
      header: `${t('SrNo')}`, // Header for the serial number
      cell: ({ row }: any) => (
        <div>
          {row.index + 1} {/* Display the index + 1 for serial number */}
        </div>
      ),
    },
    { accessorKey: "taluka_id", header: `${t('talukaName')}` },
    { accessorKey: "gp_id", header: `${t('gpid')}` },

    { accessorKey: "name", header: `${t('entermahasulgaaven')}` },
    { accessorKey: "name_marathi", header: `${t('entermahasulgaavmr')}` },
    { accessorKey: "total_population", header: `${t('population')}` },
    { accessorKey: "trible_population", header: `${t('triblepopulation')}` },
    { accessorKey: "arthik_maryada", header: `${t('Income')}` },
    { accessorKey: "village_type", header: `${t('villagetype')}` },
    { accessorKey: "status", header: `${t('status')}` },
    {
      accessorKey: "actions",
      header: `${t('Action')}`,
      cell: ({ row }: any) => (
        <div style={{ display: "flex", whiteSpace: "nowrap" }}>
          <button
            className="btn btn-sm btn-primary"
            onClick={() => handleEdit(row.original)}
          >

            <KTIcon iconName={"pencil"} className="fs-6" iconType="solid" />
            {t('edit')}
          </button>
          <button
            className={`btn btn-sm ${row.original.status === "Active" ? "btn-danger" : "btn-warning"
              } ms-5`}
            onClick={() =>
              handleDeactivate(row.original.id, row.original.status)
            }
          >
            <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
            {row.original.status === "Active" ? `${t('Deactive')}` : `${t('Active')}`}
          </button>
        </div>
      ),
    },
  ];

  useEffect(() => {
    if (talukaId) {
      const filtered = grampanchayat.filter((gp) => gp.taluka_id == talukaId);

      setFilteredGrampanchayat(filtered);
    } else {
      setFilteredGrampanchayat(grampanchayat); // Reset if no Taluka is selected
    }
  }, [talukaId, grampanchayat]);

  const handleDeactivate = async (mahasulid: number | string, currentStatus: string) => {
    console.log("Handle Deactivate Called", mahasulid, currentStatus); // Log for debugging

    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this cluster?"
        : "Are you sure you want to activate this cluster?";

    const confirmed = await confirm({ confirmation: confirmMessage });
    console.log("Confirmation Result:", confirmed); // Log the confirmation result

    if (confirmed) {
      try {
        const newStatus = currentStatus === "Active" ? "Inactive" : "Active"; // Adjust the status text accordingly

        const response = await fetch(`/api/mahasulgaav/delete/${mahasulid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ status: newStatus }),
        });

        if (response.ok) {
          setMahsulgaav((prevData) =>
            prevData.map((mahasul) =>
              mahasul.id === mahasulid
                ? { ...mahasul, status: newStatus }
                : mahasul
            )
          );
          toast.success(
            `Cluster ${newStatus === "Active" ? "activated" : "deactivated"
            } successfully!`
          );
        } else {
          const errorData = await response.json();
          toast.error(
            `Failed to change the cluster status: ${errorData.error || "Unknown error"
            }`
          );
        }
      } catch (error) {
        console.error("Error changing the cluster status:", error);
        toast.error("An unexpected error occurred.");
      }
    }
  };

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    resetForm();
  };

  const resetForm = () => {
    setTownName("");
    setNameMarathi("");
    setTalukaId("");
    setPopulation("");
    setTriblePopulation("");
    setArthikMaryada("");
    setVillageType("");
    setStatus("Active");
    setError("");
    setUpdateTownId(null);
  };
  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    setIsLoading(true); // Start loading

    try {
      const method = updateTownId ? "PUT" : "POST";
      const url = updateTownId
        ? `/api/mahasulgaav/update`
        : `/api/mahasulgaav/insert`;

      // Prepare data for submission
      const bodyData = {
        id: updateTownId !== null ? updateTownId : undefined,
        taluka_id: talukaId,
        gp_id: townName,
        name: nameEnglish,
        name_marathi: nameMarathi,
        total_population: population,
        trible_population: triblePopulation,
        arthik_maryada: arthikMaryada,
        village_type: villageType,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {

        if (!updateTownId) {
          // If inserting a new entry
          const newVillage = await response.json(); // Assuming API returns the new village object

          setMahsulgaav((prevData) => [...prevData, newVillage]);
        } else {
          // If updating an existing entry
          setMahsulgaav((prevData: any) =>
            prevData.map((gp: any) =>
              gp.id === updateTownId ? { ...gp, ...bodyData } : gp
            )
          );
        }

        toast.success(
          `Village ${updateTownId ? "updated" : "inserted"} successfully!`
        );
        handleClosePrint();
      } else {
        const data = await response.json();
        toast.error(
          `Failed to ${updateTownId ? "update" : "insert"} Village: ${data.error}`
        );
      }
    } catch (error) {
      console.error("Error during operation:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }

  };


  const handleEdit = (gp: any) => {
    setUpdateTownId(gp.id);
    setTownName(gp.g_id); // Use gp.gp_id to set the townName
    setNamenglish(gp.name);
    setNameMarathi(gp.name_marathi);
    setTalukaId(gp.t_id);
    setPopulation(gp.total_population);
    setTriblePopulation(gp.trible_population);
    setArthikMaryada(gp.arthik_maryada);
    setVillageType(gp.village_type);
    setStatus(gp.status);

    handleShowPrint();
  };

  return (
    <div>
      <Table
        data={data}
        columns={columns}
        Button={
          <Button
            variant="primary"
            onClick={() => {
              resetForm(); // Reset for new entry
              handleShowPrint();
            }}
            className="btn btn-sm"

          >
            <KTIcon iconName={"plus-circle"} className="fs-3" iconType="solid" />
            {t('addmahasulgaav')}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={
          updateTownId
            ? `${t('updatepage')}`
            : `${t('insertpage')}`
        }
        formData={{
          fields: [
            {
              label: `${t('selecttaluka')}`,
              value: talukaId || "", // Default value when updating
              onChange: (e: any) => setTalukaId(e.target.value),
              type: "select",
              options: talukas.map((taluka: any) => ({
                value: taluka.id,
                label: taluka.name,
              })),
              placeholder: `${t('selecttaluka')}`, // Optional placeholder for select input

            },


            {
              label: `${t('selectmahasul')}`,
              value: townName, /// Ensure this uses townName
              type: "select",
              placeholder: `${t('selectmahasul')}`,
              onChange: (e: any) => setTownName(e.target.value), // Keep this to set townName

              options: grampanchayat
                .filter((type) =>
                  String(type.taluka_id) == talukaId

                )
                .map((yojna) => ({
                  value: yojna.id,
                  label: yojna.name,
                })),
            },

            {
              label: `${t('entermahasulgaaven')}`,
              value: nameEnglish || "",
              type: "text",
              required: true,
              placeholder: `${t('entermahasulgaaven')}`,
              onChange: (e: any) => setNamenglish(e.target.value),
            },
            {
              label: `${t('entermahasulgaavmr')}`,
              value: nameMarathi || "",
              type: "text",
              required: true,
              placeholder: `${t('entermahasulgaavmr')}`,
              onChange: (e: any) => setNameMarathi(e.target.value),
            },
            {
              label: `${t('entervillagetype')}`,
              value: villageType,
              type: "select",
              placeholder: `${t('entervillagetype')}`,
              onChange: (e: any) => setVillageType(e.target.value), // Keep this to set townName
              options: [
                { label: "TCP", value: "TCP" },
                { label: "OTSP", value: "OTSP" },
                // Add other options here if needed
              ],
            },

            {
              label: `${t('entertotalpopulation')}`,
              value: population || "",
              type: "text",
              required: true,
              placeholder: `${t('entertotalpopulation')}`,
              onChange: (e: any) => setPopulation(e.target.value),
            },
            {
              label: `${t('entertribalepopulation')}`,
              value: triblePopulation || "",
              type: "text",
              required: true,
              placeholder: `${t('entertribalepopulation')}`,
              onChange: (e: any) => setTriblePopulation(e.target.value),
            },
            {
              label: `${t('enterincome')}`,
              value: arthikMaryada || "",
              type: "text",
              required: true,
              placeholder: `${t('enterincome')}`,
              onChange: (e: any) => setArthikMaryada(e.target.value),
            },
          ],
          error,
        }}
        submitButtonLabel={
          updateTownId
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

export default Mahsulgaav;
