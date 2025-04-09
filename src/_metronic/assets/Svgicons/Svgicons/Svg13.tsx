import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    style={{
      fill: "#056ee9",
    }}
    viewBox="0 0 64 64"
    {...props}
  >
    <path d="M28 11a2 2 0 0 0-2 2v1H13a2 2 0 0 0 0 4h1.16l2.541 30.498c.256 3.085 2.885 5.502 5.98 5.502h18.637c3.096 0 5.724-2.417 5.98-5.502L49.84 18H51a2 2 0 0 0 0-4H38v-1a2 2 0 0 0-2-2h-8z" />
  </svg>
);
export { SvgComponent as IconCross };
