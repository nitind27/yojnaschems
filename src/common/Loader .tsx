// components/Loader.js
"use client"
import React from 'react';

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="spinner-border text-primary" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
      <style jsx>{`
        .loader-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          background-color: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(5px);
          z-index: 9999; /* Ensure it is above other content */
        }
      `}</style>
    </div>
  );
};

export default Loader;