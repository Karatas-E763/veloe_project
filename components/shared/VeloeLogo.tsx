import Image from "next/image";

const LOGO_SRC = "/images/logo.png";

export function VeloeLogoCyan({ className = "h-9 sm:h-10" }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Veloe"
      width={500}
      height={500}
      quality={100}
      sizes="(max-width: 640px) 36px, 40px"
      className={`w-auto ${className} brightness-0 invert`}
      priority
    />
  );
}

export function VeloeLogoNavy({ className = "h-9 sm:h-10" }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Veloe"
      width={500}
      height={500}
      quality={100}
      sizes="(max-width: 640px) 36px, 40px"
      className={`w-auto ${className}`}
      priority
    />
  );
}
