import React, { Suspense } from "react";
import SignInImg from "../Signinimg/Signinimg";
// import ResetPassword from "@/components/auth/resetPassword/resetPassword";

const Reset_Password = () => {
  return (
    <div className="row d-flex vh-100 w-100 ">
      <div
        style={{ backgroundColor: "#F5F8FA" }}
        className="col-lg-8 col-md-7 p-0 col-12  "
      >
        <SignInImg />
      </div>
      <div className="col-lg-4 col-md-5 col-12 p-0 col-12 bg-white ">
        <Suspense>
          {/* <ResetPassword /> */}
        </Suspense>
      </div>
    </div>
  );
};

export default Reset_Password;
