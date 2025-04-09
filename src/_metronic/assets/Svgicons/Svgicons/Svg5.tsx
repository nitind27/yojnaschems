import * as React from "react"
import { SVGProps } from "react"

const SvgComponent = (props: SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="50"
    height="50"
    viewBox="0 0 80 50"
    fill="none"
    {...props}
  >
    <path
      fill="#EF305E"
      d="M61.114 2.777 76.323 50.13c.829 2.582-1.097 5.223-3.809 5.223H61.331a4 4 0 0 1-3.813-2.789L42.483 5.211C41.663 2.63 43.589 0 46.295 0h11.01a4 4 0 0 1 3.809 2.777Z"
    />
    <g filter="url(#a)">
      <path
        fill="#F4F4F4"
        d="M46.548 37.8 35.825 3.45a4.913 4.913 0 0 0-9.597 1.213L24.919 30.34a8.002 8.002 0 0 0 .325 2.7l5.822 19.46a4 4 0 0 0 3.832 2.854h5.411a4 4 0 0 0 3.811-2.784l2.407-7.548c.748-2.347.756-4.869.021-7.221Z"
      />
      <path
        fill="url(#b)"
        d="M46.548 37.8 35.825 3.45a4.913 4.913 0 0 0-9.597 1.213L24.919 30.34a8.002 8.002 0 0 0 .325 2.7l5.822 19.46a4 4 0 0 0 3.832 2.854h5.411a4 4 0 0 0 3.811-2.784l2.407-7.548c.748-2.347.756-4.869.021-7.221Z"
      />
    </g>
    <path
      fill="#EF305E"
      d="M20.317 0h11.015c2.697 0 4.62 2.615 3.819 5.19L20.269 52.947a4 4 0 0 1-3.818 2.81H5.436c-2.697 0-4.621-2.614-3.819-5.19L16.498 2.81A4 4 0 0 1 20.317 0Z"
    />
    <defs>
      <linearGradient
        id="b"
        x1={11.6}
        x2={19.6}
        y1={9.8}
        y2={12.2}
        gradientUnits="userSpaceOnUse"
      >
        <stop stopOpacity={0.2} />
        <stop offset={0.911} stopColor="#fff" stopOpacity={0} />
      </linearGradient>
      <filter
        id="a"
        width={22.185}
        height={55.353}
        x={24.908}
        y={0}
        colorInterpolationFilters="sRGB"
        filterUnits="userSpaceOnUse"
      >
        <feFlood floodOpacity={0} result="BackgroundImageFix" />
        <feBlend in="SourceGraphic" in2="BackgroundImageFix" result="shape" />
        <feColorMatrix
          in="SourceAlpha"
          result="hardAlpha"
          values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
        />
        <feOffset dx={-4} dy={3} />
        <feComposite in2="hardAlpha" k2={-1} k3={1} operator="arithmetic" />
        <feColorMatrix values="0 0 0 0 0.904167 0 0 0 0 0.892865 0 0 0 0 0.892865 0 0 0 0.4 0" />
        <feBlend in2="shape" result="effect1_innerShadow_5011_1731" />
      </filter>
    </defs>
  </svg>
);

export { SvgComponent as IconLogo }
