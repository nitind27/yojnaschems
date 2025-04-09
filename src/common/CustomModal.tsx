import React, { useState } from "react";
import { Modal, Button, Form, InputGroup } from "react-bootstrap";
import Flatpickr from "react-flatpickr";
import "flatpickr/dist/themes/material_blue.css"; // Adjust the theme based on your preference
import Select from 'react-select';

type FormField = {
  label: string;
  value: string | number | File | null;
  placeholder?: string;


  error?: string;
  onChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => void;
  type: "text" | "select" | "file" | "date" | "checkbox" | "email" | "selectcustom"; // Added email type
  options?: { value: string | number; label: string }[];
  className?: string; // Optional className property
  required?: boolean; // New property to indicate if field is required
  disabled?: boolean;
  filterdata?: any;
  btttongroupgp?: any
  btttongroupgpvi?: any



};

// Enhanced validation function with conditional logic
const validateForm = (fields: FormField[]) => {
  const errors: { [key: string]: string } = {};

  fields.forEach((field) => {
    // Check if field is required and validate accordingly
    if (field.required && !field.value) {
      errors[field.label] = `${field.label} is required`;
    }
    // Validate text fields for alphanumeric characters including Marathi and other languages
    if (field.type === "text" && typeof field.value === 'string') {
      // Regex for alphanumeric characters, spaces, and support for all languages
      const regex = /^[\p{L}\p{N}\p{M} ]*$/u;
      // \p{L} = Letters, \p{N} = Numbers, \p{M} = Marks (e.g., diacritics), space included

      if (!regex.test(field.value)) {
        errors[field.label] = `${field.label} should only contain letters, numbers, and spaces. Special characters are not allowed.`;
      }
    }



    // Validate email format
    if (field.type === "email" && typeof field.value === 'string') {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(field.value)) {
        errors[field.label] = `Please enter a valid email address`;
      }
    }

    // Example of conditional validation for population input
    if (field.label === "Enter Population" && typeof field.value === 'string') {
      const populationValue = parseInt(field.value, 10);
      if (isNaN(populationValue) || populationValue <= 0) {
        errors[field.label] = "Population must be a positive number";
      }
    }

    // Validate select box
    if (field.type === "select" && field.value === "") {
      errors[field.label] = "Please select an option";
    }

    // Validate file input (if required)
    if (field.type === "file" && field.required && !field.value) {
      errors[field.label] = `${field.label} is required`;
    }

    // Validate checkbox input (if required)
    if (field.type === "checkbox" && field.required && !(field.value as unknown as boolean)) {
      errors[field.label] = `${field.label} must be checked`;
    }
  });

  return errors;
};

const CustomModal: React.FC<any> = ({
  show,
  handleClose,
  handleSubmit,
  title,
  formData,
  filterdata,
  imagepriview,
  selectoption,
  btttongroupgp,
  btttongroupgpvi,
  titiledetails,
  submitButtonLabel = "Submit",
  disabledButton = false,
  size,
}) => {

  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});

  const onSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    const errors = validateForm(formData.fields);

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return; // Stop submission if there are errors
    }

    handleSubmit(event);
    setFormErrors({});
  };

  const closeModal = () => {
    setFormErrors({}); // Reset form errors
    handleClose();     // Call original handleClose function
  };
  // Determine grid classes based on size prop
  const gridClass = size ? 'col-6 col-md-3' : 'col-12';
// console.log("selectoption",selectoption.map((data)=>data.value))
  return (
    <Modal show={show} size={size}>
      <Modal.Header closeButton onClick={closeModal}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <span style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
          {imagepriview}
        </span>

        {titiledetails &&
          <span style={{ display: "flex", justifyContent: "start", alignItems: "center", gap: "50px", marginBottom: "20px" }}>

            <span style={{ fontSize: "20px", fontWeight: "bold" }}>बचत गट :</span> <span style={{ fontSize: "20px", fontWeight: "bold" }}>{titiledetails}</span>
          </span>
        }

        <Form onSubmit={onSubmit}>
          <div className="row">
            {formData.fields.map((field: any, index: any) => (
              <div className={field.className || gridClass} key={index} style={{ marginBottom: "15px" }}>
                <Form.Group controlId={`formField${index}`}>
                  <span className="fw-bold">

                    {field.label}
                  </span>

                  {field.type === "text" ? (

                    <Form.Control
                      type="text"
                      value={field.value as string}
                      onChange={field.onChange as any}
                      placeholder={field.placeholder}
                      disabled={field.disabled}
                      className="mt-2"
                      isInvalid={!!formErrors[field.label]}
                    />
                  ) :
                    field.type === "textwithoutval" ? (

                      <Form.Control
                        type="text"
                        value={field.value as string}
                        onChange={field.onChange as any}
                        placeholder={field.placeholder}
                        disabled={field.disabled}
                        className="mt-2"
                      // isInvalid={!!formErrors[field.label]}
                      />
                    ) :
                      field.type === "url" ? (

                        <Form.Control
                          type="url"
                          value={field.value as string}
                          onChange={field.onChange as any}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          className="mt-2"
                        // isInvalid={!!formErrors[field.label]}
                        />
                      ) : field.type === "email" ? (
                        <Form.Control
                          type="email"
                          value={field.value as string}
                          onChange={field.onChange as any}
                          placeholder={field.placeholder}
                          disabled={field.disabled}
                          className="mt-2"
                          isInvalid={!!formErrors[field.label]}
                        />
                      ) : field.type === "select" ? (
                        <Form.Control
                          as="select"
                          value={field.value as string}
                          disabled={field.disabled}
                          className="mt-2"
                          onChange={field.onChange as any}
                          isInvalid={!!formErrors[field.label]}
                        >
                          <option value="">
                            {field.placeholder || "Select an option"}
                          </option>
                          {field.options?.map((option: any) => (
                            <option key={option.value} value={option.value}>
                              {option.label}
                            </option>
                          ))}
                        </Form.Control>
                      ) : field.type === "selectcustom" ? (
                        <Select
                        isMulti
                 
                        name="customSelect"
                        defaultValue={field.value as string}
                        onChange={(selected) => {
                          field.onChange({
                            target: {
                              value: selected,
                            },
                          } as any);
                        }}
                        options={field.options || selectoption}
                        className="basic-multi-select"
                        classNamePrefix="select"
                      />
                      ) : field.type === "inputselectgp" ? (
                        <InputGroup className="mt-2">
                          <Form.Control
                            as="select"
                            value={field.value as string}
                            disabled={field.disabled}
                            className=""

                            onChange={field.onChange as any}
                            isInvalid={!!formErrors[field.label]}
                          >
                            <option value="">
                              {field.placeholder || "Select an option"}
                            </option>
                            {field.options?.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Control>


                          {btttongroupgp}

                        </InputGroup>
                      ) : field.type === "inputselectvi" ? (
                        <InputGroup className="mt-2">
                          <Form.Control
                            as="select"
                            value={field.value as string}
                            disabled={field.disabled}
                            className=""

                            onChange={field.onChange as any}
                            isInvalid={!!formErrors[field.label]}
                          >
                            <option value="">
                              {field.placeholder || "Select an option"}
                            </option>
                            {field.options?.map((option: any) => (
                              <option key={option.value} value={option.value}>
                                {option.label}
                              </option>
                            ))}
                          </Form.Control>


                          {btttongroupgpvi}

                        </InputGroup>
                      ) : field.type === "file" ? (
                        <Form.Control
                          type="file"
                          className="mt-2"
                          onChange={(e: any) => {
                            if (e.target.files) {
                              field.onChange(e);
                            }
                          }}
                          isInvalid={!!formErrors[field.label]}
                        />
                      ) : field.type === "date" ? (
                        <Form.Control
                          type="date"

                          value={field.value ? new Date(field.value).toISOString().split("T")[0] : ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            field.onChange({
                              target: { value: e.target.value },
                            } as any);
                          }}
                          disabled={field.disabled}
                          className="form-control mt-2"
                        />

                      ) : field.type === "checkbox" ? (
                        <>


                          <Form.Check
                            type="checkbox"
                            label={field.placeholder || field.label}
                            checked={!!(field.value as any)}
                            className="mt-3"
                            onChange={(e) =>
                              field.onChange({
                                target: { value: e.target.checked },
                              } as any)
                            }
                            isInvalid={!!formErrors[field.label]}
                          />

                        </>
                      ) : null}

                  {/* Show error message only for required fields */}
                  {formErrors[field.label] && (
                    <div style={{ color: "red", marginTop: "0.25rem" }}>
                      {formErrors[field.label]}
                    </div>
                  )}
                </Form.Group>
              </div>
            ))}
          </div>

          {formData.error && (
            <div style={{ color: "red", marginTop: "0.25rem" }}>
              <ul style={{ paddingLeft: "1rem" }}>
                {formData.error.split("<br />").map((err: any, index: any) => (
                  <li key={index}>{err}</li>
                ))}
              </ul>
            </div>
          )}
          <span style={{
            display: 'flex',
            justifyContent: 'flex-end', // or 'end' in some frameworks
            width: '100%' // Ensure the span takes full width
          }}>
            {submitButtonLabel.length !== 0 &&
              <Button
                variant="primary"
                type="submit"
                className="mt-3"
                disabled={disabledButton}
              >
                {submitButtonLabel}
              </Button>
            }
          </span>

        </Form>
        {filterdata}
      </Modal.Body>
    </Modal >
  );
};

export default CustomModal;