"use client";

import { useRegistration } from "@/context/RegistrationContext";
import type { DeliveryChoice } from "@/lib/types";

const options: {
  value: DeliveryChoice;
  title: string;
  description: string;
  icon: React.ReactNode;
}[] = [
  {
    value: "yes",
    title: "Sim",
    description: "Desejo receber em minha casa.",
    icon: <HomeIcon />,
  },
  {
    value: "no",
    title: "Não",
    description: "Já tenho e preciso apenas contratar um plano.",
    icon: <TagIcon />,
  },
];

export default function StepDelivery({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useRegistration();
  const isValid = formData.deliveryChoice === "yes" || formData.deliveryChoice === "no";

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold leading-tight text-veloe-navy sm:text-[1.65rem]">
        Você deseja receber um adesivo Veloe?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-veloe-navy/70 sm:text-[15px]">
        Escolha abaixo a opção que melhor atende à sua necessidade.
      </p>

      <div className="mt-6 space-y-3 sm:mt-8">
        {options.map((option) => {
          const selected = formData.deliveryChoice === option.value;
          return (
            <button
              key={option.value}
              type="button"
              onClick={() => updateFormData({ deliveryChoice: option.value })}
              className={`flex w-full items-center gap-4 rounded-2xl border-2 bg-white p-4 text-left transition-all sm:p-5 ${
                selected
                  ? "border-veloe-cyan shadow-[0_4px_16px_rgba(38,208,224,0.15)]"
                  : "border-gray-200 hover:border-veloe-cyan/40"
              }`}
            >
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-gray-100">
                {option.icon}
              </div>
              <div className="flex-1">
                <p className="font-bold text-veloe-navy">{option.title}</p>
                <p className="mt-0.5 text-sm text-veloe-navy/60">
                  {option.description}
                </p>
              </div>
              <div
                className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-all ${
                  selected
                    ? "border-veloe-cyan bg-veloe-cyan"
                    : "border-gray-300 bg-white"
                }`}
              >
                {selected && (
                  <div className="h-2 w-2 rounded-full bg-white" />
                )}
              </div>
            </button>
          );
        })}
      </div>

      <button
        type="button"
        onClick={onNext}
        disabled={!isValid}
        className={`mt-8 w-full rounded-full py-4 text-base font-bold transition-all ${
          isValid
            ? "bg-veloe-navy text-white shadow-[0_4px_16px_rgba(29,27,132,0.3)] hover:bg-veloe-navy-dark"
            : "cursor-not-allowed bg-[#e1e1eb] text-gray-400"
        }`}
      >
        Continuar
      </button>
    </div>
  );
}

function HomeIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="#1d1b84" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="7" width="16" height="10" rx="2" stroke="#1d1b84" strokeWidth="1.5" />
      <text x="8" y="15" fill="#26d0e0" fontSize="6" fontWeight="700">v</text>
    </svg>
  );
}
