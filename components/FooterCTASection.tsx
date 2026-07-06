import { CTAButton } from "./HeroSection";

const features = [
  { icon: <PhoneIcon />, label: "100% digital" },
  { icon: <CheckIcon />, label: "Sem burocracia" },
  { icon: <TruckIcon />, label: "Entrega rápida" },
];

export default function FooterCTASection() {
  return (
    <section className="px-4 py-8 pb-12 sm:px-6 sm:py-10 sm:pb-14 md:px-8 md:py-12 md:pb-16">
      <div className="mx-auto max-w-6xl overflow-hidden rounded-[28px] bg-veloe-navy px-5 py-8 sm:rounded-[32px] sm:px-8 sm:py-10 md:px-12 md:py-14">
        <div className="flex flex-col items-start gap-7 sm:gap-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
          <div className="flex-1">
            <h2 className="text-[1.35rem] font-bold leading-snug text-white sm:text-2xl md:text-3xl lg:text-[2rem] lg:leading-tight">
              Aproveite agora mesmo e garanta até{" "}
              <span className="text-veloe-cyan">2 TAGs gratuitas!</span>
            </h2>

            <div className="mt-6 flex flex-col gap-4 sm:mt-7 sm:flex-row sm:flex-wrap sm:gap-6 md:mt-8 md:gap-8 lg:gap-10">
              {features.map((feature) => (
                <div
                  key={feature.label}
                  className="flex items-center gap-2.5 text-white sm:gap-3"
                >
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/20 bg-white/10 sm:h-10 sm:w-10">
                    {feature.icon}
                  </div>
                  <span className="text-[13px] font-medium sm:text-sm md:text-base">
                    {feature.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="w-full shrink-0 sm:w-auto">
            <CTAButton className="w-full justify-center sm:w-auto" />
          </div>
        </div>
      </div>
    </section>
  );
}

function PhoneIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect
        x="7"
        y="3"
        width="10"
        height="18"
        rx="2"
        stroke="white"
        strokeWidth="1.5"
      />
      <circle cx="12" cy="18" r="1" fill="white" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="9" stroke="white" strokeWidth="1.5" />
      <path
        d="M8 12l3 3 5-5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TruckIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path
        d="M1 14h15v-4H1v4zM16 14h3l2-3v3h-5zM16 10V6H1v4M5 18a2 2 0 100-4 2 2 0 000 4zM18 18a2 2 0 100-4 2 2 0 000 4z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
