import React from "react";
import { Modal } from "react-bootstrap";

type DataItem = {
  label: string;
  content: string | number;
};

const Custommodellable: React.FC<any> = ({
  show,
  handleClose,
  title,
  imagepriview,
  dataItems, // Array of data items to show below the image
  size,
}) => {
  
  const closeModal = () => {
    handleClose(); // Call original handleClose function
  };

  return (
    <Modal show={show} size={size}>
      <Modal.Header closeButton onClick={closeModal}>
        <Modal.Title>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {/* Image Preview */}
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ marginBottom: "20px" }}>
            {imagepriview}
          </div>

          {/* Map through the dataItems array to display labels and content */}
          {dataItems && dataItems.map((item: DataItem, index: number) => (
            <div
              key={index}
              style={{
                display: "flex",
                justifyContent: "space-between",
                width: "100%",
                maxWidth: "400px",
                marginBottom: "10px",
                fontSize: "16px",
              }}
            >
              {/* Label */}
              <span style={{ fontWeight: "bold", marginRight: "10px" }}>{item.label}:</span>
              
              {/* Content */}
              <span>{item.content}</span>
            </div>
          ))}
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default Custommodellable;
