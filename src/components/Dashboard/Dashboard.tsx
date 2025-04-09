import { useTranslations } from "next-intl";
import React from "react";

const Dashboard = () => {
  const t = useTranslations("IndexPage");

  return (
    <div>
      <h1 className="text-4xl mb-4 font-semibold">{t("title")}</h1>
    </div>
  );
};

export default Dashboard;
