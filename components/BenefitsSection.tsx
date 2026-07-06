const benefits = [
  {
    icon: <CarIcon />,
    title: "Passagem mais rápida",
    description: "Use o Free Flow e evite filas nos pedágios.",
  },
  {
    icon: <ParkingIcon />,
    title: "Estacionamentos sem filas",
    description: "Pagamento automático em estacionamentos conveniados.",
  },
  {
    icon: <PhoneIcon />,
    title: "Tudo pelo app",
    description:
      "Acompanhe seus gastos, faturas e muito mais pelo app Veloe.",
  },
  {
    icon: <BrazilIcon />,
    title: "Aceita em todo o país",
    description:
      "Milhares de pontos de aceitação em pedágios e estacionamentos.",
  },
];

export default function BenefitsSection() {
  return (
    <section className="bg-veloe-light px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <div className="grid grid-cols-1 divide-y divide-gray-200/80 overflow-hidden rounded-[28px] bg-white shadow-[0_4px_32px_rgba(29,27,132,0.06)] sm:rounded-[32px] md:grid-cols-2 md:divide-x md:divide-y-0 lg:grid-cols-4">
          {benefits.map((benefit) => (
            <div
              key={benefit.title}
              className="flex flex-col items-center px-5 py-8 text-center sm:px-6 sm:py-9 md:py-10"
            >
              <div className="flex h-[60px] w-[60px] items-center justify-center rounded-full bg-veloe-cyan text-white shadow-[0_4px_12px_rgba(38,208,224,0.35)] sm:h-16 sm:w-16">
                {benefit.icon}
              </div>
              <h3 className="mt-4 text-[15px] font-bold text-veloe-navy sm:mt-5 sm:text-base md:text-lg">
                {benefit.title}
              </h3>
              <p className="mt-2 max-w-[220px] text-[13px] leading-relaxed text-veloe-navy/70 sm:text-sm md:max-w-none md:text-[15px]">
                {benefit.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function CarIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M5 17h14M5 17a2 2 0 01-2-2v-3l2-5h14l2 5v3a2 2 0 01-2 2M5 17a2 2 0 104 0M15 17a2 2 0 104 0"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path d="M7 9h10" stroke="white" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ParkingIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <rect
        x="4"
        y="4"
        width="16"
        height="16"
        rx="3"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M9 8h3.5a2.5 2.5 0 010 5H9V8z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
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

function BrazilIcon() {
  return (
    <svg width="26" height="26" viewBox="0 0 24 24" fill="none">
      <path
        d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
        stroke="white"
        strokeWidth="1.5"
      />
      <path
        d="M4 12h16M12 4c-2 2.5-3 5.5-3 8s1 5.5 3 8c2-2.5 3-5.5 3-8s-1-5.5-3-8z"
        stroke="white"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}
