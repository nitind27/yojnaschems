"use client";
import React, { useEffect } from "react";
import Card from "@/common/Card";
import Link from "next/link";
import { useLocale } from "next-intl";
import { usePathname } from "next/navigation";

const Nbschemescard = ({
  yojnaname,
  yojnacount,
  yojnaid,
  subcategoryid,
  filteryojnayear,
}: {
  yojnaname: any;
  yojnacount: any;
  yojnaid: any;
  subcategoryid: any;
  filteryojnayear: any
}) => {
  const localActive = useLocale();

  return (
    <div>
      <Link
        href={`/${localActive}/dashboard/nbschemes/nbschemesdata/${yojnaid}/${subcategoryid}/${filteryojnayear}`}
      >
        <Card
          title={yojnaname}
          backgroundColor="#27222e"
          content={
            <>
              <div className="d-flex justify-content-between fw-bold fs-6 text-white opacity-75 w-100">
                <span style={{ fontSize: "20px" }}>{yojnacount}</span>
              </div>
            </>
          }
        />
      </Link>
    </div>
  );
};

export default Nbschemescard;
