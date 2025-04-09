"use client";
import { useEffect } from "react";
import clsx from "clsx";
import { usePathname } from "next/navigation";
import { WithChildren } from "@/_metronic/helpers";
import { DrawerComponent } from "@/_metronic/assets/ts/components";
import { useLayout } from "@/layout/core";

const Content = ({ children }: WithChildren) => {
  const { config, classes } = useLayout();
  const location = usePathname();
  useEffect(() => {
    DrawerComponent.hideAll();
  }, [location]);

  const appContentContainer = config.app?.content?.container;
  return (
    <div
      id="kt_app_content"
      className={clsx(
        "app-content flex-column-fluid",
        classes.content.join(" "),
        config?.app?.content?.class
      )}
    >
      {appContentContainer ? (
        <div
          id="kt_app_content_container"
          className={clsx("app-container", classes.contentContainer.join(" "), {
            "container-xxl": appContentContainer === "fixed",
            "container-fluid": appContentContainer === "fluid",
          })}
        >
          {children}
        </div>
      ) : (
        <div>{children}</div>
      )}
    </div>
  );
};

export { Content };
