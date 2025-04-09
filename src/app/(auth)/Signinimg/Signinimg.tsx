"use client"
import { useEffect, useState } from "react";
import Image from "next/image";
import img from "/public/media/logos/loginlogo.png";

const SignInImg = () => {
  const [isMobile, setIsMobile] = useState(false);

  // Effect to determine if the screen is mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768); // Set mobile breakpoint at 768px
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call handler initially to set state

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className="d-flex h-100 flex-column flex-root" id="kt_app_root">
      <div className="d-flex flex-column flex-lg-row flex-column-fluid">
        <div className="d-flex flex-lg-row-fluid">
          <div className="d-flex flex-column flex-center pb-0 pb-lg-10 p-10 w-100">
            <Image
              src={img}
              alt="logo"
              className="mx-auto mb-5 mb-lg-2"
              style={{
                width: isMobile ? '100px' : '350px', // Set width based on screen size
                height: isMobile ? '100px' : 'auto', // Set height based on screen size
                maxWidth: '100%', // Ensure it does not exceed container width
              }}
            />
            <div
              style={{ color: "#78829d" }}
              className="text-gray w-600px fs-4 text-center fw-semibold"
            >
              {/* Insert additional content or description here */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignInImg;
