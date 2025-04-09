"use client";
import React from "react";
import { useTranslations } from "next-intl";

const Schooltitle = () => {
  const t = useTranslations("student");

  return <div>{t("title")}</div>;
};

export default Schooltitle;
