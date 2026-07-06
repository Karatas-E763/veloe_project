import Image from "next/image";

const LOGO_SRC = "/images/logo.png";

export function VeloeLogoCyan({ className = "h-[50px] sm:h-14" }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Veloe"
      width={500}
      height={500}
      quality={100}
      sizes="(max-width: 640px) 50px, 56px"
      className={`w-auto ${className} brightness-0 invert`}
      priority
    />
  );
}

export function VeloeLogoNavy({ className = "h-[50px] sm:h-14" }: { className?: string }) {
  return (
    <Image
      src={LOGO_SRC}
      alt="Veloe"
      width={500}
      height={500}
      quality={100}
      sizes="(max-width: 640px) 50px, 56px"
      className={`w-auto ${className}`}
      priority
    />
  );
}
