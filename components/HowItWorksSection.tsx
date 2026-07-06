const steps = [
  {
    number: "1",
    icon: <BankIcon />,
    text: "Verifique se seu banco é parceiro Veloe",
  },
  {
    number: "2",
    icon: <TagIcon />,
    text: "Resgate até 2 TAGs gratuitas",
  },
  {
    number: "3",
    icon: <CarIcon />,
    text: "Comece a usar e aproveite os benefícios",
  },
];

export default function HowItWorksSection() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-14">
      <div className="mx-auto max-w-6xl rounded-[28px] bg-veloe-light px-5 py-8 sm:rounded-[32px] sm:px-8 sm:py-10 md:px-10 md:py-14">
        <h2 className="text-center text-lg font-bold text-veloe-navy sm:text-xl md:text-2xl">
          Como funciona
        </h2>

        <div className="mt-8 flex flex-col items-center gap-1 sm:mt-10 md:hidden">
          {steps.map((step, index) => (
            <div key={step.number} className="flex flex-col items-center">
              <StepCircle step={step} />
              <p className="mt-3 max-w-[240px] text-center text-[13px] font-medium leading-snug text-veloe-navy sm:mt-4 sm:text-sm">
                {step.text}
              </p>
              {index < steps.length - 1 && (
                <div className="my-2 sm:my-3">
                  <DashedArrow vertical />
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="mt-12 hidden items-start justify-center md:mt-14 md:flex">
          {steps.map((step, index) => (
            <div key={step.number} className="flex items-start">
              <div className="flex flex-col items-center">
                <StepCircle step={step} />
                <p className="mt-4 max-w-[170px] text-center text-sm font-medium leading-snug text-veloe-navy lg:mt-5 lg:max-w-[200px] lg:text-[15px]">
                  {step.text}
                </p>
              </div>
              {index < steps.length - 1 && (
                <div className="mx-1 mt-9 shrink-0 lg:mx-3 xl:mx-5">
                  <DashedArrow />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function StepCircle({
  step,
}: {
  step: { number: string; icon: React.ReactNode; text: string };
}) {
  return (
    <div className="relative">
      <span className="absolute -left-0.5 -top-0.5 z-10 flex h-6 w-6 items-center justify-center rounded-full bg-veloe-navy text-[11px] font-bold text-white sm:h-7 sm:w-7 sm:text-xs">
        {step.number}
      </span>
      <div className="flex h-[72px] w-[72px] items-center justify-center rounded-full bg-veloe-cyan text-white shadow-[0_4px_16px_rgba(38,208,224,0.35)] sm:h-20 sm:w-20 md:h-[88px] md:w-[88px]">
        {step.icon}
      </div>
    </div>
  );
}

function DashedArrow({ vertical = false }: { vertical?: boolean }) {
  if (vertical) {
    return (
      <svg width="20" height="36" viewBox="0 0 20 36" fill="none">
        <path
          d="M10 0v28M10 28l-4-4M10 28l4-4"
          stroke="#b0b8c4"
          strokeWidth="1.5"
          strokeDasharray="4 4"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <svg width="56" height="20" viewBox="0 0 56 20" fill="none" className="lg:w-16">
      <path
        d="M0 10h40M40 10l-5-5M40 10l-5 5"
        stroke="#b0b8c4"
        strokeWidth="1.5"
        strokeDasharray="4 4"
        strokeLinecap="round"
      />
    </svg>
  );
}

function BankIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M3 21h18M4 18h16M6 18V9M10 18V9M14 18V9M18 18V9M2 9l10-5 10 5"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <rect
        x="3"
        y="7"
        width="8"
        height="10"
        rx="1.5"
        stroke="white"
        strokeWidth="1.5"
      />
      <rect
        x="13"
        y="7"
        width="8"
        height="10"
        rx="1.5"
        stroke="white"
        strokeWidth="1.5"
      />
      <path d="M11 12h2" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function CarIcon() {
  return (
    <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 17h14M5 17a2 2 0 01-2-2v-3l2-5h14l2 5v3a2 2 0 01-2 2M5 17a2 2 0 104 0M15 17a2 2 0 104 0"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
