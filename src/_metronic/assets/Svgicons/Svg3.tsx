import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    style={{
      fill: "#0040de",
    }}
    viewBox="0 0 300 290"
  >
    <path
      strokeMiterlimit={10}
      d="M12.97 6a1.002 1.002 0 0 0-.152.018.998.998 0 0 0-.357.14.999.999 0 0 0-.178.145l-9.99 9.99a.72.72 0 0 0-.07.078.996.996 0 0 0-.078.113 1.002 1.002 0 0 0-.07.143.998.998 0 0 0-.038.105 1.002 1.002 0 0 0-.037.284V40c0 2.197 1.803 4 4 4h29c2.197 0 4-1.803 4-4v-4.336l6.703 5.697c1.244 1.059 3.297.11 3.297-1.523V10.162c0-1.225-1.154-2.064-2.256-1.96a1.86 1.86 0 0 0-1.04.437L39 14.336V10c0-2.197-1.803-4-4-4H13a1.017 1.017 0 0 0-.03 0zM14 8h21c1.117 0 2 .883 2 2v6.037l-8 6.8V17a1 1 0 0 0-1-1H14zm-2 1.414V16H5.414zm35 .748v29.676l-8-6.8V16.962zM4 18h8v14H4zm10 0h13v14H14zm23 .662v12.676L29.545 25zm-8 8.5 8 6.8V40c0 1.117-.883 2-2 2H14v-8h14a1 1 0 0 0 1-1zM4 34h8v8H6c-1.117 0-2-.883-2-2z"
      fontFamily="none"
      fontSize="none"
      fontWeight="none"
      style={{
        mixBlendMode: "normal",
      }}
      textAnchor="none"
      transform="scale(5.12)"
    />
  </svg>
)
export { SvgComponent as IconMeet }
