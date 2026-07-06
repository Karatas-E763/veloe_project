"use client";

import { useMemo, useState } from "react";
import { useRegistration } from "@/context/RegistrationContext";
import {
  formatLicensePlate,
  validateLicensePlate,
} from "@/lib/validation";
import type { VehicleType } from "@/lib/types";

const vehicleTypes: { value: VehicleType; label: string }[] = [
  { value: "CARRO", label: "CARRO" },
  { value: "MOTO", label: "MOTO" },
  { value: "CAMINHAO", label: "CAMINHÃO" },
];

export default function StepVehicle({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useRegistration();
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.licensePlate && !validateLicensePlate(formData.licensePlate)) {
      e.licensePlate = "Placa inválida (ex: ABC1D23)";
    }
    if (
      touched.confirmLicensePlate &&
      formData.confirmLicensePlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() !==
        formData.licensePlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase()
    ) {
      e.confirmLicensePlate = "As placas não coincidem";
    }
    if (touched.vehicleType && !formData.vehicleType) {
      e.vehicleType = "Selecione o tipo de veículo";
    }
    return e;
  }, [formData, touched]);

  const platesMatch =
    formData.licensePlate.trim().length > 0 &&
    formData.confirmLicensePlate.trim().length > 0 &&
    formData.confirmLicensePlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase() ===
      formData.licensePlate.replace(/[^a-zA-Z0-9]/g, "").toUpperCase();

  const isValid = platesMatch && !!formData.vehicleType;

  const handleSubmit = () => {
    setTouched({
      licensePlate: true,
      confirmLicensePlate: true,
      vehicleType: true,
    });
    if (isValid) onNext();
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold leading-tight text-veloe-navy sm:text-[1.65rem]">
        Sua tag vai ativa e pronta para uso.
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-veloe-navy/70 sm:text-[15px]">
        Preencha as informações do carro que vai usar a tag.
      </p>

      <div className="mt-6 space-y-4 sm:mt-8">
        <VehicleField
          icon={<CarIcon />}
          label="Placa"
          value={formData.licensePlate}
          onChange={(v) =>
            updateFormData({ licensePlate: formatLicensePlate(v) })
          }
          error={errors.licensePlate}
        />
        <VehicleField
          icon={<ShieldIcon />}
          label="Confirmar placa"
          value={formData.confirmLicensePlate}
          onChange={(v) =>
            updateFormData({ confirmLicensePlate: formatLicensePlate(v) })
          }
          error={errors.confirmLicensePlate}
        />

        <div className="relative">
          <button
            type="button"
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className={`flex w-full items-center gap-3 rounded-xl border-b-2 bg-[#f0f2f8] px-4 py-3 text-left transition-colors ${
              errors.vehicleType ? "border-red-300" : "border-veloe-navy"
            }`}
          >
            <span className="text-veloe-navy/40">
              <CarIcon />
            </span>
            <div className="flex-1">
              <p className="text-[11px] text-gray-400">Selecione o tipo de veículo</p>
              <p className="font-bold text-veloe-navy">
                {formData.vehicleType
                  ? vehicleTypes.find((v) => v.value === formData.vehicleType)?.label
                  : "Selecione..."}
              </p>
            </div>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              className={`text-veloe-navy transition-transform ${dropdownOpen ? "rotate-180" : ""}`}
            >
              <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute left-0 right-0 z-20 mt-1 overflow-hidden rounded-xl border border-gray-200 bg-white shadow-lg">
              {vehicleTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  onClick={() => {
                    updateFormData({ vehicleType: type.value });
                    setDropdownOpen(false);
                  }}
                  className={`block w-full px-4 py-3 text-left text-sm font-semibold transition-colors hover:bg-veloe-cyan/10 ${
                    formData.vehicleType === type.value
                      ? "bg-veloe-cyan/10 text-veloe-navy"
                      : "text-veloe-navy/70"
                  }`}
                >
                  {type.label}
                </button>
              ))}
            </div>
          )}
          {errors.vehicleType && (
            <p className="mt-1.5 text-xs text-red-500">{errors.vehicleType}</p>
          )}
        </div>
      </div>

      <div className="mt-5 flex items-start gap-3 rounded-xl bg-[#e8f8fa] px-4 py-3.5">
        <InfoIcon />
        <p className="text-sm leading-relaxed text-veloe-navy/80">
          A tag será ativada e você poderá passar pelos pedágios e
          estacionamentos.
        </p>
      </div>

      <button
        type="button"
        onClick={handleSubmit}
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

function VehicleField({
  icon,
  label,
  value,
  onChange,
  error,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-xl border-b-2 bg-[#f0f2f8] px-4 py-3 ${
          error ? "border-red-300" : "border-veloe-navy"
        }`}
      >
        <span className="text-veloe-navy/40">{icon}</span>
        <div className="flex-1">
          <p className="text-[11px] text-gray-400">{label}</p>
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            maxLength={8}
            className="w-full bg-transparent text-base font-bold uppercase text-veloe-navy outline-none placeholder:font-normal placeholder:normal-case placeholder:text-gray-400"
            placeholder={label}
          />
        </div>
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

function CarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M5 17h14M5 17a2 2 0 01-2-2v-3l2-5h14l2 5v3a2 2 0 01-2 2M5 17a2 2 0 104 0M15 17a2 2 0 104 0" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function ShieldIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M12 2l8 4v6c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V6l8-4z" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 12l2 2 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function InfoIcon() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" className="shrink-0">
      <circle cx="12" cy="12" r="10" fill="#26d0e0" />
      <path d="M12 8v1M12 11v5" stroke="white" strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}
