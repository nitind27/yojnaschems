"use client";
import { useEffect, useState } from "react";
import { ScrollTop } from "@/components/scroll-top";
import { FooterWrapper } from "@/components/footer";
import { Sidebar } from "@/components/sidebar";

import { PageDataProvider } from "./core";

import { usePathname } from "next/navigation";
import { reInitMenu } from "@/_metronic/helpers";
import { HeaderWrapper } from "@/components/header";

const MasterLayout = ({ children }: { children: React.ReactNode }) => {
  const pathname = usePathname();
  useEffect(() => {
    reInitMenu();
  }, [pathname]);
  const [fontSize, setFontSize] = useState<number>(14); // Default font size

  const increase = () => {
    setFontSize((prevSize) => prevSize + 2);
  };

  const decrease = () => {
    setFontSize((prevSize) => Math.max(prevSize - 2, 10));
  };
  const resetsize = () => {
    setFontSize(14);
  };


  return (
    <PageDataProvider>
      <div className="d-flex flex-column flex-root app-root" id="kt_app_root">
        <div
          className="app-page flex-column flex-column-fluid"
          id="kt_app_page"
        >

          <HeaderWrapper
            decrease={decrease}
            increase={increase}
            resetsize={resetsize}
          />
          <div
            className="app-wrapper flex-column flex-row-fluid"
            id="kt_app_wrapper"
          >
            <Sidebar />
            <div
              className="app-main flex-column flex-row-fluid"
              id="kt_app_main"
            >
              <div className="app-container container-xxl d-flex flex-column flex-column-fluid">
                <span style={{ fontSize: `${fontSize}px` }}>{children}</span>
              </div>
              <FooterWrapper />
            </div>
          </div>
        </div>
      </div>

      <ScrollTop />
    </PageDataProvider>
  );
};

export { MasterLayout };
