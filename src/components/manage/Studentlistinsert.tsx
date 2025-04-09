import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { useScholarship } from '../table/ScholarshipContext';
import './Studentlistinsert.css'; // Import your CSS file
import { tblstudentsscholarship } from '../type';

const Studentlistinsert = ({ formattedScholarshipIDs, studentid, filterscholarship, updateTownId, formattedScholarshipname, scholarship }: any) => {
    const [selectedStudents, setSelectedStudents] = useState<number[]>([]);
    const { selectedScholarship } = useScholarship(); // Removed setSelectedScholarship as it's not used here

    const handleCheckboxChange = (studentId: number) => {
        // Check if a scholarship is selected
        if (!selectedScholarship) {
            toast.error("Please select a scholarship first.");
            return;
        }

        setSelectedStudents((prev) => {
            const updatedSelected = prev.includes(studentId)
                ? prev.filter(id => id !== studentId)
                : [...prev, studentId];

            return updatedSelected;
        });
    }

    useEffect(() => {
        if (selectedStudents.length > 0) {
            handleSubmit(selectedStudents);
        }
    }, [selectedStudents]);

    const handleSubmit = async (updatedSelected: number[]) => {
        // Check if the student is already selected to skip scholarship validation
        const isStudentAlreadySelected = updatedSelected.some(id => formattedScholarshipIDs.includes(id));

        if (!selectedScholarship && !isStudentAlreadySelected) {
            toast.error("Please select a scholarship first.");
            return;
        }

        const dobs = new Date();

        const bodyData = {
            student_id: "",
            serial_number: '',
            full_name: '',
            gr_no: '',
            uid: "",
            school_id: "",
            current_std: "",
            mother_name: "",
            date_of_birth: dobs,
            gender: "",
            cast: "",
            aadhaar: "",
            contact_no: "",
            address: "",
            sickle_cell: "",
            sickle_report: "",
            student_scholarship_id: updatedSelected,
            scholarship_name: selectedScholarship,
        };

        try {
            const method = updateTownId ? "PUT" : "POST";
            const url = `/api/scholarshipstudent/insert`;

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(bodyData),
            });

            if (response.ok) {
                const message = updateTownId ? "updated" : "added";
                toast.success(`Student ${message} successfully!`);

                const updatedStudent = await response.json();
                // Handle the updated student data as necessary
                // ...

                // setShowModel(false);
            } else {
                const error = await response.json();
                toast.error(`Failed to save student: ${error.message}`);
            }
        } catch (error) {
            toast.error("An unexpected error occurred.");
        } finally {
            // setIsLoading(false);
        }
    };
    const checkconditiondata = scholarship.filter((f: tblstudentsscholarship) => f.student_scholarship_id == studentid && f.status == "Active").map((d: tblstudentsscholarship) => d.scholarship_name)

    const isChecked = checkconditiondata.includes(selectedScholarship) &&
        formattedScholarshipIDs.includes(studentid) || selectedStudents.includes(studentid);

    const isDisabled = isChecked;

    return (
        <div>
            <input
                type="checkbox"
                value={studentid}
                onChange={() => handleCheckboxChange(studentid)}
                checked={isChecked}
                disabled={isDisabled} // Disable checkbox if already checked
                className={`custom-checkbox ${isDisabled ? 'disabled' : ''}`} // Add custom class
                style={{ cursor: isDisabled ? 'not-allowed' : 'pointer' }} // Change cursor style for disabled 
            />
        </div>
    );
}

export default Studentlistinsert;
