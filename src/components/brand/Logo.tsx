type LogoMarkProps = {
  size?: number
  className?: string
}

/** The smartup "X" pinwheel mark — blue vertical wedges, green horizontal wedges. */
export function LogoMark({ size = 40, className }: LogoMarkProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-label="smartup"
    >
      <defs>
        <clipPath id="logo-rounded">
          <rect width="100" height="100" rx="26" />
        </clipPath>
      </defs>
      <g clipPath="url(#logo-rounded)">
        {/* top + bottom wedges — blue */}
        <path d="M0 0 L100 0 L50 50 Z" fill="#1B9CD8" />
        <path d="M0 100 L100 100 L50 50 Z" fill="#1B9CD8" />
        {/* left + right wedges — green */}
        <path d="M0 0 L0 100 L50 50 Z" fill="#43B02A" />
        <path d="M100 0 L100 100 L50 50 Z" fill="#43B02A" />
      </g>
    </svg>
  )
}

type LogoProps = {
  className?: string
  markSize?: number
}

/** Full lockup: mark + "smartup" wordmark. */
export function Logo({ className, markSize = 30 }: LogoProps) {
  return (
    <div className={`inline-flex items-center gap-2 ${className ?? ''}`}>
      <LogoMark size={markSize} />
      <span className="text-2xl font-semibold tracking-tight text-neutral-900">
        smartup
      </span>
    </div>
  )
}
