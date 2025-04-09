import React from "react";

type CardProps = {
  title: string;
  content: React.ReactNode;
  backgroundColor?: string;
};

const Card = ({ title, content, backgroundColor }: CardProps) => {
  return (
    <div
      className="card card-flush bgi-no-repeat bgi-position-x-end h-md-100"
      style={{
        backgroundColor,
        borderRadius: "15px",
        boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
        padding: "30px", // Increased padding for better spacing
        display: "flex", // Use flexbox for centering
        flexDirection: "column", // Stack children vertically
        justifyContent: "center", // Center vertically
        alignItems: "center", // Center horizontally
        height: "100%", // Ensure the card takes full height
      }}
    >
      <h2 className="fs-2hx fw-bold text-white me-2 lh-1 ls-n2 text-center ">
        <span style={{ fontSize: "18px" }}><center>{title}
        </center></span>
      </h2>
      <div className="content text-white" style={{ textAlign: "center" }}>
        <span>{content}</span>
      </div>
    </div>
  );
};

export default Card;