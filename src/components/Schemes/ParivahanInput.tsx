import { useTranslations } from 'next-intl';
import React, { useState, useEffect } from 'react';
import { useAppContext } from './Contaxt/AppContext';
import { TblEvaluation, TblEvaluationAmount } from '../type';
import { toast } from 'react-toastify';
import { createConfirmation } from 'react-confirm';
import ConfirmationDialog from '@/common/ConfirmationDialog';
import { useRouter } from 'next/navigation';
interface BeneficiaryData {
    evaluation_id: string;
    yojana_type: string;
    gat_name?: string;
    fullname?: string;
    tot_finance: string;
    fourty?: string;
    sixty?: string;
    hundred?: string;
    fortyPercent?: string;
    sixtyPercent?: string;
    hundredPercent?: string;
    editconditioncheckfor?: string;
}

interface ParivahanInputProps {
    beneficiaryData: BeneficiaryData[];
    TblEvaluationAmount: TblEvaluationAmount[];
    TblEvaluation: TblEvaluation[];
    row: any;
    // handleDeactivate: (evaluation_id: string) => void;
    handleimageshow: (data: any) => void;
}

const ParivahanInput: React.FC<ParivahanInputProps> = ({ beneficiaryData, row, handleimageshow, TblEvaluation, TblEvaluationAmount }) => {
    const t = useTranslations("parivahan");
    const [inputValues, setInputValues] = useState<Record<string, { fortyPercent?: string; sixtyPercent?: string; hundredPercent?: string }>>({});

    const [beneficiaryid, setBeneficiaryid] = useState("");
    const [evaluationid, setEvaluationid] = useState("");
    const [hundredPercent, setHundredPercent] = useState("");
    const { inputData, setInputData } = useAppContext(); // Use Context
    const confirm = createConfirmation(ConfirmationDialog);
    const [parivahandata, setparivahandata] =
        useState<TblEvaluation[]>(TblEvaluation);
    const router = useRouter();
    useEffect(() => {
        const mappedData = Object.entries(inputValues).map(([key, value]: any) => {
            return {
                id: key,
                ...value
            };
        });


        const inputmapdata = mappedData.length > 0 ? [mappedData[0]] : [];

        if (inputmapdata.length > 0) {
            const beneficiaryId = inputmapdata.map((data: any) => data.beneficiary_id).join() as any;
            const evaluationId = inputmapdata.map((data: any) => data.evaluation_id).join() as any;
            const hundredPercentValue = inputmapdata.map((data: any) => data.hundredPercent).join() as any;

            setBeneficiaryid(beneficiaryId);
            setEvaluationid(evaluationId);
            setHundredPercent(hundredPercentValue);

            // Only call handleSubmit when all values are available
            if (beneficiaryId && evaluationId && hundredPercentValue) {

                handleSubmit(beneficiaryId, evaluationId, hundredPercentValue);
            }

        } else {
            console.log("No data available");
        }
    }, [inputValues])
    useEffect(() => {
        const initialValues: Record<string, { fortyPercent?: string; sixtyPercent?: string; hundredPercent?: string }> = {};
        beneficiaryData.forEach(data => {
            initialValues[data.evaluation_id] = {
                fortyPercent: data.fortyPercent || '',
                sixtyPercent: data.sixtyPercent || '',
                hundredPercent: data.hundredPercent || ''
            };
        });
        setInputValues(initialValues);

    }, [beneficiaryData]);



    const handleDeactivateWithLogging = (
        evaluation_id: string,
        field: keyof typeof inputValues[string],
        value: string,
        beneficiary_id: any
    ) => {
        setInputValues((prevValues) => ({
            ...prevValues,
            [evaluation_id]: {
                ...prevValues[evaluation_id], // Preserve existing properties of evaluation_id
                evaluation_id,               // Update evaluation_id explicitly
                beneficiary_id,              // Update beneficiary_id explicitly
                [field]: value,              // Update the specific field with the new value
            },
        }));


    };



    const handleDeactivate = async (category_id: any) => {

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

    };

    const handleSubmit = async (beneficiaryid: any, evaluationid: any, hundredPercent: any) => {

        const confirmMessage = "Are you sure want to Add ?";
        const confirmed = await confirm({ confirmation: confirmMessage } as any);
        if (confirmed) {
            try {
                const method = "POST";
                const url = `/api/parivahan/parivahanamountadd`;

                // Prepare the request body
                const requestBody = {
                    beneficiary_id: beneficiaryid,
                    evaluation_id: evaluationid,
                    amount: hundredPercent as any,

                };


                const response = await fetch(url, {
                    method,
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(requestBody),
                }); if (response.ok) {
                    router.refresh();
                    handleDeactivate(evaluationid);
                }
            }

            catch (error) {
                console.error("Error during operation:", error);
                toast.error("An unexpected error occurred.");
            }
        }
    };


    const handleDelete = async (category_id: any) => {
        const categoryid = String(category_id)

        const confirmMessage = "Are you sure you want to Delete?";
        const confirmed = await confirm({ confirmation: confirmMessage } as any);
        if (confirmed) {
            try {
                const response = await fetch(`/api/evaluationamount/deletedata/${categoryid}`, {
                    method: "DELETE",

                });

                if (response.ok) {
                    toast.success(
                        ` ${"Deleted"
                        } successfully!`
                    );
                    router.refresh();
                }

            } catch (error) {
                console.error("Error changing the Category status:", error);
                toast.error("An unexpected error occurred.");
            }
        }
    };
    const tblinputparivahandata = TblEvaluationAmount.filter((data) => data.evaluation_id == row.original.evaluation_id).map((data) => data.evaluation_id)
    const tblinputparivahandataid = TblEvaluationAmount.filter((data) => data.evaluation_id == row.original.evaluation_id).map((data) => data.id)

    return (
        <div>
            <div className="overflow-x-auto">

                <table className="min-w-full border border-gray-300">
                    <thead className="bg-gray-200">
                        <tr>
                            <th className="border px-4 py-2">{t("SrNo")}</th>
                            <th className="border px-4 py-2">{t("name")}</th>
                            <th className="border px-4 py-2">{t("total")}</th>
                            <th className="border px-4 py-2">{t("AmountPaid")}</th>
                            <th className="border px-4 py-2">{t("Interest")}</th>
                            <th className="border px-4 py-2">Action</th>
                            <th className="border px-4 py-2">Photo</th>
                        </tr>
                    </thead>
                    <tbody>
                        {beneficiaryData.map((data, index) => (
                            <React.Fragment key={data.evaluation_id}>
                                <tr className="border border-gray-300">
                                    <td className="border px-4 py-2" rowSpan={4}>{index + 1}</td>
                                    <td className="border px-4 py-2" rowSpan={4}>{data.yojana_type === "2" ? data.gat_name : data.fullname}</td>
                                    <td className="border px-4 py-2" rowSpan={4}>{data.tot_finance}</td>
                                </tr>
                                {data.fourty === "Yes" && (
                                    <tr className="border border-gray-300">
                                        <td className="border px-4 py-2">40%</td>
                                        <td className="border px-4 py-2">

                                            <input
                                                type="text"
                                                value={inputValues[data.evaluation_id]?.fortyPercent}
                                                disabled
                                                className="border px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td
                                            className="border px-4 py-2 text-green-600 cursor-pointer"
                                            onClick={() => handleDeactivateWithLogging(row.original.evaluation_id, 'hundredPercent', inputValues[data.evaluation_id]?.fortyPercent as any, row.original.beneficiary_id)}>      {tblinputparivahandata == row.original.evaluation_id ? "Delete" : "अदा"}</td>
                                        <td
                                            className="border px-4 py-2 text-red-600 cursor-pointer"
                                            onClick={() => handleimageshow(data)}>photo</td>
                                    </tr>
                                )}
                                {data.sixty === "Yes" && (
                                    <tr className="border border-gray-300">
                                        <td className="border px-4 py-2">60%</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                value={inputValues[data.evaluation_id]?.sixtyPercent}
                                                disabled
                                                className="border px-2 py-1 w-full"
                                            />
                                        </td>
                                        <td
                                            className="border px-4 py-2 text-green-600 cursor-pointer"
                                            onClick={() => handleDeactivateWithLogging(row.original.evaluation_id, 'hundredPercent', inputValues[data.evaluation_id]?.sixtyPercent as any, row.original.beneficiary_id) as any}>      {tblinputparivahandata == row.original.evaluation_id ? "Delete" : "अदा"}

                                        </td>
                                        <td
                                            className="border px-4 py-2 text-red-600 cursor-pointer"
                                            onClick={() => handleimageshow(data)}>photo</td>
                                    </tr>
                                )}
                                {data.hundred === "Yes" && (
                                    <tr className="border border-gray-300">
                                        <td className="border px-4 py-2">100%</td>
                                        <td className="border px-4 py-2">
                                            <input
                                                type="text"
                                                value={inputValues[data.evaluation_id]?.hundredPercent}
                                                disabled

                                                className="border px-2 py-1 w-full"
                                            />

                                        </td>

                                        <td
                                            className="border px-4 py-2 text-green-600 cursor-pointer"
                                            onClick={() => tblinputparivahandata != row.original.evaluation_id ? handleDeactivateWithLogging(row.original.evaluation_id, 'hundredPercent', inputValues[data.evaluation_id]?.hundredPercent as any, row.original.beneficiary_id) : handleDelete(TblEvaluationAmount.filter((data) => data.evaluation_id == row.original.evaluation_id).map((data) => data.id))}>

                                            {tblinputparivahandata == row.original.evaluation_id ? "Delete" : "अदा"}

                                        </td>

                                        {/* <td
                                            className="border px-4 py-2 text-green-600 cursor-pointer"
                                            onClick={() => handleDelete(TblEvaluationAmount.filter((data) => data.evaluation_id == row.original.evaluation_id).map((data) => data.id))}>
                                            Delete
                                        </td> */}

                                        <td
                                            className="border px-4 py-2 text-red-600 cursor-pointer"
                                            onClick={() => handleimageshow(data)}>photo</td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default ParivahanInput;
