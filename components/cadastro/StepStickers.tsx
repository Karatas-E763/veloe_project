"use client";

import { useRegistration } from "@/context/RegistrationContext";

export default function StepStickers({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useRegistration();
  const count = formData.stickerCount;

  const decrease = () => {
    if (count > 1) updateFormData({ stickerCount: count - 1 });
  };

  const increase = () => {
    if (count < 2) updateFormData({ stickerCount: count + 1 });
  };

  const label = count === 1 ? "1 Adesivo" : "2 Adesivos";

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold leading-tight text-veloe-navy sm:text-[1.65rem]">
        Quantos adesivos você deseja?
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-veloe-navy/70 sm:text-[15px]">
        Você pode solicitar até 2 adesivos gratuitos.
      </p>

      <div className="mt-8 flex items-center justify-between rounded-2xl border border-gray-200 bg-white px-5 py-6 sm:px-8">
        <button
          type="button"
          onClick={decrease}
          disabled={count <= 1}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
            count <= 1
              ? "cursor-not-allowed bg-[#e8e8f0] text-veloe-navy/30"
              : "bg-[#e8e8f0] text-veloe-navy hover:bg-veloe-cyan/20"
          }`}
          aria-label="Diminuir quantidade"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M6 12h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>

        <span className="text-xl font-bold text-veloe-navy sm:text-2xl">
          {label}
        </span>

        <button
          type="button"
          onClick={increase}
          disabled={count >= 2}
          className={`flex h-11 w-11 items-center justify-center rounded-full transition-all ${
            count >= 2
              ? "cursor-not-allowed bg-veloe-navy/30 text-white/50"
              : "bg-veloe-navy text-white hover:bg-veloe-navy-dark"
          }`}
          aria-label="Aumentar quantidade"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
            <path d="M12 6v12M6 12h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
          </svg>
        </button>
      </div>

      <div className="mt-4 flex items-center gap-2 rounded-xl bg-[#eef0f8] px-4 py-3">
        <InfoIcon />
        <p className="text-sm text-veloe-navy/70">
          Você pode solicitar até 2 adesivos.
        </p>
      </div>

      <button
        type="button"
        onClick={onNext}
        className="mt-8 w-full rounded-full bg-veloe-navy py-4 text-base font-bold text-white shadow-[0_4px_16px_rgba(29,27,132,0.3)] transition-all hover:bg-veloe-navy-dark"
      >
        Continuar
      </button>
    </div>
  );
}

function InfoIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="#26d0e0" />
      <path d="M12 8v1M12 11v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
