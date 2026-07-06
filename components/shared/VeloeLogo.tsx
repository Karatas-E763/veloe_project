export function VeloeLogoCyan({ className = "h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 120 32"
      className={`w-auto ${className}`}
      aria-label="Veloe"
      role="img"
    >
      <text
        x="0"
        y="24"
        fill="#26d0e0"
        fontFamily="Montserrat, sans-serif"
        fontWeight="700"
        fontSize="28"
        letterSpacing="-0.5"
      >
        veloe
      </text>
      <path
        d="M78 26 Q84 30 90 26"
        stroke="#26d0e0"
        strokeWidth="2"
        fill="none"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function VeloeLogoNavy({ className = "h-7" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 130 36"
      className={`w-auto ${className}`}
      aria-label="Veloe"
      role="img"
    >
      <rect x="0" y="4" width="28" height="28" rx="6" fill="#26d0e0" />
      <path
        d="M8 22V14h3.5c2 0 3.2 1.1 3.2 2.7 0 1.1-.6 2-1.6 2.4L16 22h-2.4l-1.5-2.5H10.5V22H8zm2.5-4.5h1c.9 0 1.4-.4 1.4-1.1s-.5-1.1-1.4-1.1h-1v2.2z"
        fill="#1d1b84"
      />
      <text
        x="36"
        y="26"
        fill="#1d1b84"
        fontFamily="Montserrat, sans-serif"
        fontWeight="700"
        fontSize="26"
      >
        veloe
      </text>
    </svg>
  );
}
