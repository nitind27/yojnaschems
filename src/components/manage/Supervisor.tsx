"use client";
import React, { useState } from "react";
import Table from "../table/Table"; // Adjust path if necessary
import { Button } from "react-bootstrap";
import { KTIcon } from "@/_metronic/helpers"; // Adjust if needed
import CustomModal from "@/common/CustomModal"; // Adjust path if necessary
import type { grampanchayat, Padnam, Supervisor, UserCategory } from "../type";
import { toast } from "react-toastify";
import { validateFormsupervisor } from "@/utils/Validation";
import { useTranslations } from "next-intl";
import { createConfirmation } from "react-confirm";
import ConfirmationDialog from "@/common/ConfirmationDialog";

type Props = {
  UserCategory: UserCategory[];
  Padname: Padnam[];
  initialSupervisorlData: Supervisor[];
};

const Supervisor = ({
  initialSupervisorlData,
  UserCategory,
  Padname,
}: Props) => {
  const [showPrintModal, setShowPrintModal] = useState(false);
  const [username, setUserName] = useState("");
  const [PadName, setPadName] = useState("");
  const [Category, setCategory] = useState("");
  const [contactNo, setContactNo] = useState("");
  const [Password, setPassword] = useState("");
  const [address, setAddress] = useState("");
  const [status, setStatus] = useState("Active");
  const [error, setError] = useState("");
  const [updateTownId, setUpdateTownId] = useState<number | null>(null);
  const [supervisors, setSupervisors] = useState<Supervisor[]>(
    initialSupervisorlData
  );
  const t = useTranslations("Supervisor");
  const confirm = createConfirmation(ConfirmationDialog);
  const [isLoading, setIsLoading] = useState(false);

  const UserCategorys = UserCategory.reduce((acc, category) => {
    acc[category.user_cat_id] = category.category_name;
    return acc;
  }, {} as Record<number, string>);

  const Padnames = Padname.reduce((acc, pn) => {
    acc[pn.padnam_id] = pn.padnam;
    return acc;
  }, {} as Record<number, string>);

  const data = supervisors
    .map((supervisor) => ({
      sup_id: supervisor.sup_id,
      sup_name: supervisor.sup_name,
      sup_contact: supervisor.sup_contact,
      sup_address: supervisor.sup_address,
      sup_password: supervisor.sup_password,
      imei_number: supervisor.imei_number,
      c_id: supervisor.category_id,
      p_id: supervisor.padnam_id,
      category_id: UserCategorys[supervisor.category_id],
      padnam_id: Padnames[supervisor.padnam_id],
      sup_status: supervisor.sup_status,
    }))
    .reverse();

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
    { accessorKey: "sup_name", header: `${t("SupervisorName")}` },
    { accessorKey: "sup_contact", header: `${t("Contactnumber")}` },
    { accessorKey: "sup_address", header: `${t("address")}` },
    { accessorKey: "sup_password", header: `${t("password")}` },
    { accessorKey: "imei_number", header: `${t("imeino")}` },
    { accessorKey: "category_id", header: `${t("category")}` },
    { accessorKey: "padnam_id", header: `${t("padname")}` },
    { accessorKey: "sup_status", header: `${t("status")}` },
    {
      accessorKey: "actions",
      header: `${t("Action")}`,
      cell: ({ row }: any) => (
        <div>
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
              className={`btn btn-sm ${row.original.sup_status === "Active"
                ? "btn-danger"
                : "btn-warning"
                } ms-5`}
              onClick={() =>
                handleDeactivate(row.original.sup_id, row.original.sup_status)
              }
            >
              {" "}
              <KTIcon iconName={"status"} className="fs-6" iconType="solid" />
              {row.original.sup_status === "Active"
                ? `${t("Deactive")}`
                : `${t("Active")}`}
            </button>
          </div>
        </div>
      ),
    },
  ];

  const handleDeactivate = async (supervisorid: any, currentStatus: any) => {
    const confirmMessage =
      currentStatus === "Active"
        ? "Are you sure you want to deactivate this Supervisor?"
        : "Are you sure you want to activate this Supervisor?";

    const confirmed = await confirm({ confirmation: confirmMessage });
    if (confirmed) {
      try {
        const response = await fetch(`/api/supervisor/delete/${supervisorid}`, {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            sup_status: currentStatus === "Active" ? "Deactive" : "Active", // Consistent key
          }),
        });

        if (response.ok) {
          // Update local state without page reload
          setSupervisors((prevData) =>
            prevData.map((cluster) =>
              cluster.sup_id === supervisorid
                ? {
                  ...cluster,
                  sup_status:
                    currentStatus === "Active" ? "Inactive" : "Active",
                } // Consistent key
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

  const handleShowPrint = () => setShowPrintModal(true);

  const handleClosePrint = () => {
    setShowPrintModal(false);
    resetForm();
  };

  const resetForm = () => {
    setUserName("");
    setAddress("");
    setContactNo("");
    setCategory("");
    setPassword("");
    setPadName("");
    setStatus("Active");
    setError("");
    setUpdateTownId(null);
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    // const errorMsg = validateFormsupervisor(
    //   username,
    //   PadName,
    //   Category,
    //   contactNo,
    //   Password,
    //   address
    // );

    // if (errorMsg.length > 0) {
    //   // Set error by joining messages with <br /> for multiline display
    //   setError(errorMsg.join("<br />"));
    //   return;
    // }
    // setIsLoading(true); // Start loading

    try {
      const method = updateTownId ? "PUT" : "POST";
      const url = updateTownId
        ? `/api/supervisor/update` // URL for updating the supervisor
        : `/api/supervisor/insert`; // URL for inserting a new supervisor

      const bodyData = {
        sup_id: updateTownId ?? undefined, // Only pass ID if updating
        sup_name: username,
        sup_contact: contactNo,
        sup_address: address,
        sup_password: Password || undefined, // Pass undefined if no new password
        category_id: Category,
        padnam_id: PadName,
        sup_status: status,
      };

      const response = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      if (response.ok) {
        if (!updateTownId) {
          // If inserting a new entry
          const supervisordata = await response.json();

          setSupervisors((prevData) => [...prevData, supervisordata]);
        } else {
          // If updating an existing entry
          setSupervisors((prevData: any) =>
            prevData.map((balance: any) =>
              balance.sup_id === updateTownId
                ? { ...balance, ...bodyData }
                : balance
            )
          );
        }
        toast.success(
          `Supervisor ${updateTownId ? "updated" : "inserted"} successfully!`
        );
        handleClosePrint();
      } else {
        const data = await response.json();
        toast.error(
          `Failed to ${updateTownId ? "update" : "insert"} supervisor: ${data.error
          }`
        );
      }
    } catch (error) {
      console.error("Error during operation:", error);
      toast.error("An unexpected error occurred.");
    } finally {
      setIsLoading(false); // End loading
    }
  };

  const handleEdit = (supervisor: any) => {
    setUpdateTownId(supervisor.sup_id);
    setUserName(supervisor.sup_name);
    setContactNo(supervisor.sup_contact);
    setAddress(supervisor.sup_address);
    setPassword(supervisor.sup_password);
    setCategory(supervisor.c_id);
    setPadName(supervisor.p_id);
    setStatus(supervisor.sup_status);

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
            <KTIcon
              iconName={"plus-circle"}
              className="fs-3"
              iconType="solid"
            />
            {t("addSupervisor")}
          </Button>
        }
      />

      <CustomModal
        show={showPrintModal}
        handleClose={handleClosePrint}
        handleSubmit={handleSubmit}
        title={updateTownId ? `${t("updatepage")}` : `${t("insertpage")}`}
        formData={{
          fields: [
            {
              label: `${t("enterusername")}`,
              value: username,
              required: true,
              type: "text",
              onChange: (e: any) => setUserName(e.target.value),
            },
            {
              label: `${t("enterpadname")}`,
              value: PadName,
              required: true,
              onChange: (e: any) => setPadName(e.target.value),
              type: "select",
              options: Padname.map((pn) => ({
                value: pn.padnam_id,
                label: pn.padnam,
              })),
            },
            {
              label: `${t("entercategory")}`,
              value: Category,
              required: true,
              onChange: (e: any) => setCategory(e.target.value),
              type: "select",
              options: UserCategory.map((category) => ({
                value: category.user_cat_id,
                label: category.category_name,
              })),
            },
            {
              label: `${t("entercontactno")}`,
              value: contactNo,
              required: true,
              type: "text",
              // onChange: (e : any) => setContactNo(e.target.value),

              onChange: (e: any) => {
                // Ensure that only digits are allowed and limit to 11 digits
                const inputValue = e.target.value;
                if (/^\d*$/.test(inputValue) && inputValue.length <= 10) {
                  setContactNo(inputValue);
                }
              },
            },
            {
              label: `${t("enterpassword")}`,
              value: Password,
              required: true,
              type: "text",
              onChange: (e: any) => setPassword(e.target.value),
            },
            {
              label: `${t("enteraddress")}`,
              value: address,
              required: true,
              type: "text",
              onChange: (e: any) => setAddress(e.target.value),
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

export default Supervisor;
