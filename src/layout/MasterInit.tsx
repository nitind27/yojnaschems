"use client";
import { useEffect, useState } from "react";
import { useLayout } from "./core";
import { Tab } from "bootstrap";
import { ThemeModeComponent } from "@/_metronic/assets/ts/layout";
import {
  DrawerComponent,
  MenuComponent,
  ScrollComponent,
  ScrollTopComponent,
  StickyComponent,
  SwapperComponent,
  ToggleComponent,
} from "@/_metronic/assets/ts/components";

export function MasterInit() {
  const { config } = useLayout();
  const [initialized, setInitialized] = useState(false);
  const pluginsInitialization = () => {
    ThemeModeComponent.init();
    setTimeout(() => {
      ToggleComponent.bootstrap();
      ScrollTopComponent.bootstrap();
      DrawerComponent.bootstrap();
      StickyComponent.bootstrap();
      MenuComponent.bootstrap();
      ScrollComponent.bootstrap();
      SwapperComponent.bootstrap();
      document.querySelectorAll('[data-bs-toggle="tab"]').forEach((tab) => {
        Tab.getOrCreateInstance(tab);
      });
    }, 500);
  };

  useEffect(() => {
    if (!initialized) {
      setInitialized(true);
      pluginsInitialization();
    }
  }, [config, initialized]);

  return <></>;
}
