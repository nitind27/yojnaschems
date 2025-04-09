import * as React from "react";
import { SVGProps } from "react";
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={30}
    height={30}
    style={{
      fill: "#ff404c",
    }}
    viewBox="0 0 72 72"
    {...props}
  >
    <path d="M33 13a2 2 0 0 0-2 2v1H18a4 4 0 0 0-4 4 3.992 3.992 0 0 0 3.313 3.93l2.394 28.734C20.05 56.777 23.554 60 27.682 60h18.636c4.128 0 7.632-3.222 7.975-7.336l2.395-28.734A3.992 3.992 0 0 0 60 20a4 4 0 0 0-4-4H43v-1a2 2 0 0 0-2-2h-8z" />
  </svg>
);
export { SvgComponent as IconDelete };
