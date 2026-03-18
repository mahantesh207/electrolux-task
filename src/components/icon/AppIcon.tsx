import type { ReactNode, SVGProps } from "react"

type IconName =
  | "arrow-left"
  | "bag-shopping"
  | "basket-shopping"
  | "bolt"
  | "box-open"
  | "cart-plus"
  | "cart-shopping"
  | "layer-group"
  | "magnifying-glass"
  | "minus"
  | "plus"
  | "rotate-left"
  | "sliders"
  | "star"
  | "store"
  | "tags"
  | "trash-can"
  | "xmark"

type AppIconProps = Omit<SVGProps<SVGSVGElement>, "children" | "viewBox"> & {
  name: IconName
  size?: "sm" | "md" | "lg" | "xl"
}

const iconSizes = {
  sm: "0.875em",
  md: "1em",
  lg: "1.25em",
  xl: "1.5em",
} as const

const iconPaths: Record<IconName, ReactNode> = {
  "arrow-left": (
    <>
      <path d="M19 12H5" />
      <path d="m12 19-7-7 7-7" />
    </>
  ),
  "bag-shopping": (
    <>
      <path d="M6 8h12l-1 12H7L6 8Z" />
      <path d="M9 8V6a3 3 0 0 1 6 0v2" />
    </>
  ),
  "basket-shopping": (
    <>
      <path d="m5 10 2 9h10l2-9H5Z" />
      <path d="M9 10V8a3 3 0 0 1 6 0v2" />
      <path d="M3 10h18" />
    </>
  ),
  bolt: <path d="M13 2 5 13h5l-1 9 8-11h-5l1-9Z" />,
  "box-open": (
    <>
      <path d="m3 7 9-4 9 4-9 4-9-4Z" />
      <path d="m3 7 3 10 6 4 6-4 3-10" />
      <path d="M12 11v10" />
    </>
  ),
  "cart-plus": (
    <>
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 4h3l2.5 10.5a1 1 0 0 0 1 .75h8.5a1 1 0 0 0 .97-.76L20 8H6.5" />
      <path d="M17 3v6" />
      <path d="M14 6h6" />
    </>
  ),
  "cart-shopping": (
    <>
      <circle cx="10" cy="20" r="1" />
      <circle cx="18" cy="20" r="1" />
      <path d="M2 4h3l2.5 10.5a1 1 0 0 0 1 .75h8.5a1 1 0 0 0 .97-.76L20 8H6.5" />
    </>
  ),
  "layer-group": (
    <>
      <path d="m12 3 9 5-9 5-9-5 9-5Z" />
      <path d="m3 12 9 5 9-5" />
      <path d="m3 16 9 5 9-5" />
    </>
  ),
  "magnifying-glass": (
    <>
      <circle cx="11" cy="11" r="6.5" />
      <path d="m16 16 4.5 4.5" />
    </>
  ),
  minus: <path d="M5 12h14" />,
  plus: (
    <>
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </>
  ),
  "rotate-left": (
    <>
      <path d="M3 12a9 9 0 1 0 3-6.7" />
      <path d="M3 4v5h5" />
    </>
  ),
  sliders: (
    <>
      <path d="M4 6h6" />
      <path d="M14 6h6" />
      <circle cx="12" cy="6" r="2" />
      <path d="M4 12h10" />
      <path d="M18 12h2" />
      <circle cx="16" cy="12" r="2" />
      <path d="M4 18h4" />
      <path d="M12 18h8" />
      <circle cx="10" cy="18" r="2" />
    </>
  ),
  star: (
    <path d="m12 3.5 2.9 5.88 6.49.95-4.7 4.58 1.11 6.47L12 18.35 6.2 21.38l1.11-6.47-4.7-4.58 6.49-.95L12 3.5Z" />
  ),
  store: (
    <>
      <path d="M4 7h16l-1 4a2 2 0 0 1-2 1.5H7A2 2 0 0 1 5 11L4 7Z" />
      <path d="M5 12.5V20h14v-7.5" />
      <path d="M9 20v-4h6v4" />
      <path d="M6 7l1-3h10l1 3" />
    </>
  ),
  tags: (
    <>
      <path d="m20.5 12.5-8 8a1.5 1.5 0 0 1-2.12 0l-6.76-6.76A1.5 1.5 0 0 1 3.18 12.7V4h8.7a1.5 1.5 0 0 1 1.06.44l7.56 7.56a1.5 1.5 0 0 1 0 2.12Z" />
      <circle cx="8" cy="8" r="1" />
    </>
  ),
  "trash-can": (
    <>
      <path d="M3 6h18" />
      <path d="M8 6V4h8v2" />
      <path d="M6 6l1 14h10l1-14" />
      <path d="M10 10v6" />
      <path d="M14 10v6" />
    </>
  ),
  xmark: (
    <>
      <path d="m18 6-12 12" />
      <path d="m6 6 12 12" />
    </>
  ),
}

export default function AppIcon({
  className,
  name,
  size = "md",
  style,
  ...props
}: AppIconProps) {
  return (
    <svg
      aria-hidden="true"
      className={["app-icon", className].filter(Boolean).join(" ")}
      fill="none"
      focusable="false"
      height={iconSizes[size]}
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth="1.8"
      style={{
        flexShrink: 0,
        overflow: "visible",
        ...style,
      }}
      viewBox="0 0 24 24"
      width={iconSizes[size]}
      {...props}
    >
      {iconPaths[name]}
    </svg>
  )
}
