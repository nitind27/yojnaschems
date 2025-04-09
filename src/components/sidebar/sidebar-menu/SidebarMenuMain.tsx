import { useState, useEffect } from "react";
import { SidebarMenuItem } from "./SidebarMenuItem";
import { SidebarMenuItemWithSub } from "./SidebarMenuItemWithSub";
import { useLocale, useTranslations } from "next-intl";
import Loader from "@/common/Loader ";
import { usePathname } from "next/navigation";

const SidebarMenuMain = () => {
  const t = useTranslations("Sidebar");
  const localActive = useLocale();
  const router = usePathname();
  // State to manage loading status
  const [loading, setLoading] = useState(false);

  // Function to handle click and store path in localStorage
  const handleItemClick = (path: string) => {
    setLoading(true);
    localStorage.setItem("currentPath", path);
  };
  // Effect to monitor the router/pathname and stop loading once the page is active
  useEffect(() => {
    const handleRouteChange = () => {
      // Stop loading once the route change is detected (i.e., page is active)
      setLoading(false);
    };

    // Listen for changes in the route (this ensures that the loader shows while the page is changing)
    router && handleRouteChange(); // Check if router/pathname is available to start checking

    return () => {
      // Cleanup if necessary
    };
  }, [router]); // This effect runs when the pathname changes

  useEffect(() => {
    localStorage.removeItem("schoolName");
    localStorage.removeItem("displayedNumber");
  }, [loading]);

  const supervisorName = sessionStorage.getItem("supervisorName");


  return (

    <>
      <div>
        {loading && <Loader />}

        <SidebarMenuItem
          to={`/${localActive}/dashboard`}
          icon="home"
          title={t("dashboard")}
          fontIcon="bi-app-indicator"
          onClick={() => handleItemClick(`/${localActive}/dashboard`)} // Store path on click
        />

        <SidebarMenuItemWithSub
          to="/apps/chat"
          title={t("manage")}
          fontIcon="bi-chat-left"
          icon="burger-menu-2"
        >

          <SidebarMenuItem
            to={`/${localActive}/manage/town`}
            title={t("townmenu")}
            hasBullet={true}
            onClick={() => handleItemClick(`/${localActive}/manage/town`)} // Store path on click
          />
          <SidebarMenuItem
            to={`/${localActive}/manage/grampanchayat`}
            title={t("GramPanchayat")}
            hasBullet={true}
            onClick={() =>
              handleItemClick(`/${localActive}/manage/grampanchayat`)
            } // Store path on click
          />
          <SidebarMenuItem
            to={`/${localActive}/manage/mahsulgaav`}
            title={t("Mahsulgaav")}
            hasBullet={true}
            onClick={() => handleItemClick(`/${localActive}/manage/mahsulgaav`)} // Store path on click
          />

        </SidebarMenuItemWithSub>


        <SidebarMenuItemWithSub
          to="/apps/chat"
          title={t("nbschemes")}
          fontIcon="bi-chat-left"
          icon="burger-menu-2"
        >
          {/* List of Manage Submenu Items */}
          <SidebarMenuItem
            to={`/${localActive}/yojna/schemes/category`}
            title={t("category")}
            hasBullet={true}
            onClick={() => handleItemClick(`/${localActive}/yojna/schemes/category`)} // Store path on click
          />
          <SidebarMenuItem
            to={`/${localActive}/yojna/schemes/subcategory`}
            title={t("subcategory")}
            hasBullet={true}
            onClick={() => handleItemClick(`/${localActive}/yojna/schemes/subcategor`)} // Store path on click
          />
          <SidebarMenuItem
            to={`/${localActive}/yojna/schemes/yojnatype`}
            title={t("Plan_type")}
            hasBullet={true}
            onClick={() =>
              handleItemClick(`/${localActive}/yojna/schemes/subcateyojnatypegory`)
            } // Store path on click
          />
          <SidebarMenuItem
            to={`/${localActive}/yojna/schemes/plans`}
            title={t("Plan")}
            hasBullet={true}
            onClick={() => handleItemClick(`/${localActive}/yojna/schemes/plans`)}
          />
          <SidebarMenuItem
            to={`/${localActive}/yojna/schemes/appplans`}
            title={t("App_plan")}
            hasBullet={true}
            onClick={() => handleItemClick(`/${localActive}/yojna/schemes/appplans`)}
          />






        </SidebarMenuItemWithSub>


        <SidebarMenuItem
          to={`/${localActive}/document`}
          icon="home"
          title={"Document"}
          fontIcon="bi-app-indicator"
          onClick={() => handleItemClick(`/${localActive}/document`)} // Store path on click
        />

        <SidebarMenuItem
          to={`/${localActive}/yojnawisedoc`}
          icon="home"
          title={"Yojana Vice Documet"}
          fontIcon="bi-app-indicator"
          onClick={() => handleItemClick(`/${localActive}/yojnawisedoc`)} // Store path on click
        />

      </div>
    </>
  );
};

export { SidebarMenuMain };
