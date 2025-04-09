import React from "react";
import SignInImg from "../Signinimg/Signinimg";
import SignIn from "@/components/auth/SignIn/signIn";
import { TblUsers } from "@/components/type";
import prisma from "@/lib/db";
import Loader from "@/common/Loader ";

const Page = async () => {
  let tbluser: TblUsers[] = [];
  try {
    tbluser = await prisma.tblusers.findMany(); // Fetch all clusters
  } catch (error) {
    console.error("Error fetching cluster data:", error);
    return (
      <div>
        <h1>Error fetching Data</h1>
      </div>
    );
  }

  if (!tbluser) {
    return (
      <>
        <Loader />
      </>
    )
  }

  return (
    <div className="row d-flex vh-100 w-100 ">
      <div
        style={{ backgroundColor: "#F5F8FA" }}
        className="col-lg-8 col-md-7 p-0 col-12  "
      >
        <SignInImg />
      </div>
      <div className="col-lg-4 col-md-5 col-12 p-0 bg-white">
        <SignIn tbluserdata={tbluser} />
      </div>
    </div>
  );
};

export default Page;
