import * as React from "react";
import { SVGProps } from "react";

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    style={{
      fill: "#fff",
      border: "0",
      outline: "none",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
    }}
    viewBox="0 0 28 25"
    {...props}
  >
    <path
      fillRule="evenodd"
      strokeMiterlimit={10}
      d="M11 2v9H2v2h9v9h2v-9h9v-2h-9V2z"
      style={{
        mixBlendMode: "normal",
      }}
    />
  </svg>
);

export { SvgComponent as Iconplus };