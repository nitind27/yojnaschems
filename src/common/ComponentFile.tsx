import React, { useState, useEffect } from "react";
import { Modal, Button, Form } from "react-bootstrap";
import "flatpickr/dist/themes/material_blue.css"; // Adjust the theme based on your preference

type FormField = {
    label: string;
    name: string; // Added a name property to identify fields
    value?: string | number | File | null;
    placeholder?: string;
    type: "text" | "select" | "file" | "date" | "checkbox" | "email";
    options?: { value: string | number; label: string }[];
    className?: string;
    required?: boolean;
    disabled?: boolean;

};

const validateForm = (fields: { [key: string]: any }, schema: FormField[]) => {
    const errors: { [key: string]: string } = {};

    schema.forEach((field) => {
        const value = fields[field.name];

        // Validate required fields
        if (field.required && !value) {
            errors[field.name] = `${field.label} is required`;
        }

        // Validate email format
        if (field.type === "email" && value) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(value)) {
                errors[field.name] = `Please enter a valid email address`;
            }
        }

        // Validate text fields for alphanumeric characters including Marathi and other languages
        if (field.type === "text" && value) {
            const regex = /^[\p{L}\p{N}\p{M} ]*$/u;
            if (!regex.test(value)) {
                errors[field.name] = `${field.label} should only contain letters, numbers, and spaces.`;
            }
        }

        // Additional validation logic (e.g., population, select, etc.) can go here
    });

    return errors;
};

const ComponentFile: React.FC<any> = ({
    show,
    handleClose,
    handleSubmit,
    title,
    formData,
    imagepriview,
    submitButtonLabel = "Submit",
    disabledButton = false,
    size,
}) => {
    const [formValues, setFormValues] = useState<{ [key: string]: any }>({});
    const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

    useEffect(() => {
        // Initialize form values from the passed schema
        const initialValues: { [key: string]: any } = {};
        formData.fields.forEach((field: FormField) => {
            initialValues[field.name] = field.value || "";
        });
        setFormValues(initialValues);
    }, [formData.fields]);

    const handleChange = (name: string, value: any) => {
        setFormValues((prev) => ({ ...prev, [name]: value }));
    };

    const onSubmit = (event: React.FormEvent) => {
        event.preventDefault();

        const errors = validateForm(formValues, formData.fields);
        if (Object.keys(errors).length > 0) {
            setFormErrors(errors);
            return;
        }

        handleSubmit(formValues);
        setFormErrors({});
    };

    const gridClass = size ? "col-6 col-md-3" : "col-12";

    return (
        <Modal show={show} size={size}>
            <Modal.Header closeButton onClick={handleClose}>
                <Modal.Title>{title}</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                    {imagepriview}
                </span>
                <Form onSubmit={onSubmit}>
                    <div className="row">
                        {formData.fields.map((field: FormField, index: number) => (
                            <div className={field.className || gridClass} key={index} style={{ marginBottom: "15px" }}>
                                <Form.Group controlId={`formField${index}`}>
                                    <span className="fw-bold">{field.label}</span>
                                    {field.type === "text" || field.type === "email" ? (
                                        <Form.Control
                                            type={field.type}
                                            value={formValues[field.name] || ""}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            placeholder={field.placeholder}
                                            disabled={field.disabled}
                                            isInvalid={!!formErrors[field.name]}
                                        />
                                    ) : field.type === "select" ? (
                                        <Form.Control
                                            as="select"
                                            value={formValues[field.name] || ""}
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            disabled={field.disabled}
                                            isInvalid={!!formErrors[field.name]}
                                        >
                                            <option value="">
                                                {field.placeholder || "Select an option"}
                                            </option>
                                            {field.options?.map((option) => (
                                                <option key={option.value} value={option.value}>
                                                    {option.label}
                                                </option>
                                            ))}
                                        </Form.Control>
                                    ) : field.type === "file" ? (
                                        <Form.Control
                                            type="file"
                                            onChange={(e: any) => handleChange(field.name, e.target.files?.[0] || null)}
                                            isInvalid={!!formErrors[field.name]}
                                        />
                                    ) : field.type === "checkbox" ? (
                                        <Form.Check
                                            type="checkbox"
                                            label={field.label}
                                            checked={!!formValues[field.name]}
                                            onChange={(e) => handleChange(field.name, e.target.checked)}
                                            isInvalid={!!formErrors[field.name]}
                                        />
                                    ) : field.type === "date" ? (
                                        <Form.Control
                                            type="date"
                                            value={
                                                formValues[field.name]
                                                    ? new Date(formValues[field.name]).toISOString().split("T")[0]
                                                    : ""
                                            }
                                            onChange={(e) => handleChange(field.name, e.target.value)}
                                            disabled={field.disabled}
                                            isInvalid={!!formErrors[field.name]}
                                        />
                                    ) : null}

                                    {formErrors[field.name] && (
                                        <div style={{ color: "red", marginTop: "0.25rem" }}>
                                            {formErrors[field.name]}
                                        </div>
                                    )}
                                </Form.Group>
                            </div>
                        ))}
                    </div>

                    <Button
                        variant="primary"
                        type="submit"
                        className="mt-3"
                        disabled={disabledButton}
                    >
                        {submitButtonLabel}
                    </Button>
                </Form>
            </Modal.Body>
        </Modal>
    );
};

export default ComponentFile;
