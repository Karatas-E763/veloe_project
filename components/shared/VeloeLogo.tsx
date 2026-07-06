import Image from "next/image";

const LOGO_SRC = "/images/logo.png";

export function VeloeLogoCyan({ className = "h-7" }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Veloe"
      width={512}
      height={512}
      className={`w-auto ${className} brightness-0 invert`}
      priority
    />
  );
}

export function VeloeLogoNavy({ className = "h-7" }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Veloe"
      width={512}
      height={512}
      className={`w-auto ${className}`}
      priority
    />
  );
}
