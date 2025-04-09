import * as React from "react"
import { SVGProps } from "react"
const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    {...props}
    xmlns="http://www.w3.org/2000/svg"
    width="20"
    height="20"
    style={{
      fill: "#0040DE",
      border: "0",
      outline: "none",
    }}
    viewBox="0 0 300 290"
  >
    <path
      strokeMiterlimit={10}
      d="M16.38 4C9.556 4 4 9.555 4 16.38v17.24C4 40.444 9.555 46 16.38 46h17.24C40.444 46 46 40.446 46 33.62V16.38C46 9.556 40.446 4 33.62 4zm0 2h17.24C39.364 6 44 10.635 44 16.38v17.24C44 39.364 39.365 44 33.62 44H16.38A10.365 10.365 0 0 1 6 33.62V16.38C6 10.636 10.635 6 16.38 6zm20.823 10.629a1.648 1.648 0 0 0-.896.252l-5.633 3.52C29.994 18.44 28.178 17 25.994 17H13a1 1 0 0 0-1 1v9.994C12 30.747 14.253 33 17.006 33H30a1 1 0 0 0 1-1v-3.197l5.307 3.316c1.128.705 2.693-.162 2.693-1.492V18.373c0-.998-.88-1.735-1.797-1.744zM37 18.805v11.39l-6-3.75v-3.89zM14 19h11.994A2.991 2.991 0 0 1 29 22.006V31H17.006A2.991 2.991 0 0 1 14 27.994z"
      fontFamily="none"
      fontSize=""
      fontWeight="none"
      style={{
        mixBlendMode: "normal",
      }}
      textAnchor="none"
      transform="scale(5.12)"
    />
  </svg>
)
export { SvgComponent as IconZoom }
