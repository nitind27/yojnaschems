import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={40}
    height={40}
    style={{
      fill: "#fff",
    }}
    viewBox="0 0 300 150"
    {...props}
  >
    <path
      fillRule="evenodd"
      strokeMiterlimit={10}
      d="M11 2v9H2v2h9v9h2v-9h9v-2h-9V2z"
      fontFamily="none"
      fontSize="none"
      fontWeight="none"
      style={{
        mixBlendMode: "normal",
      }}
      textAnchor="none"
      transform="scale(10.66667)"
    />
  </svg>
)
export { SvgComponent as Iconplus }
