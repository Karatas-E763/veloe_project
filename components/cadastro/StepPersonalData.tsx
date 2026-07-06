"use client";

import { useMemo, useState } from "react";
import { useRegistration } from "@/context/RegistrationContext";
import {
  formatCPF,
  formatPhone,
  isPersonalDataFilled,
  validateCPF,
  validateEmail,
  validateFullName,
  validatePhone,
} from "@/lib/validation";
import type { DeviceType } from "@/lib/types";

interface FieldProps {
  icon: React.ReactNode;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  error?: string;
  maxLength?: number;
}

function FormField({
  icon,
  placeholder,
  value,
  onChange,
  type = "text",
  error,
  maxLength,
}: FieldProps) {
  return (
    <div>
      <div
        className={`flex items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 transition-colors ${
          error ? "border-red-300" : "border-gray-200 focus-within:border-veloe-cyan"
        }`}
      >
        <span className="shrink-0 text-veloe-navy/40">{icon}</span>
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          maxLength={maxLength}
          onChange={(e) => onChange(e.target.value)}
          className="w-full bg-transparent text-[15px] text-veloe-navy placeholder:text-gray-400 outline-none"
        />
      </div>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}

export default function StepPersonalData({ onNext }: { onNext: () => void }) {
  const { formData, updateFormData } = useRegistration();
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const errors = useMemo(() => {
    const e: Record<string, string> = {};
    if (touched.fullName && !validateFullName(formData.fullName)) {
      e.fullName = "Informe seu nome";
    }
    if (touched.cpf && !validateCPF(formData.cpf)) {
      e.cpf = "CPF inválido";
    }
    if (touched.email && !validateEmail(formData.email)) {
      e.email = "E-mail inválido";
    }
    if (touched.phone && !validatePhone(formData.phone)) {
      e.phone = "Telefone inválido";
    }
    if (touched.deviceType && !formData.deviceType) {
      e.deviceType = "Selecione seu dispositivo";
    }
    return e;
  }, [formData, touched]);

  const isFilled = isPersonalDataFilled(formData);

  const handleSubmit = () => {
    if (!isFilled) return;

    setTouched({
      fullName: true,
      cpf: true,
      email: true,
      phone: true,
      deviceType: true,
    });

    onNext();
  };

  return (
    <div className="animate-fade-in">
      <h1 className="text-2xl font-bold leading-tight text-veloe-navy sm:text-[1.65rem]">
        Para começar, preencha alguns dados
      </h1>
      <p className="mt-2 text-sm leading-relaxed text-veloe-navy/70 sm:text-[15px]">
        Precisamos dessas informações para verificar sua elegibilidade e
        prosseguir.
      </p>

      <div className="mt-6 space-y-3 sm:mt-8 sm:space-y-4">
        <FormField
          icon={<PersonIcon />}
          placeholder="Nome completo"
          value={formData.fullName}
          onChange={(v) => updateFormData({ fullName: v })}
          error={errors.fullName}
        />
        <FormField
          icon={<DocumentIcon />}
          placeholder="CPF"
          value={formData.cpf}
          onChange={(v) => updateFormData({ cpf: formatCPF(v) })}
          error={errors.cpf}
          maxLength={14}
        />
        <FormField
          icon={<EmailIcon />}
          placeholder="E-mail"
          value={formData.email}
          onChange={(v) => updateFormData({ email: v })}
          type="email"
          error={errors.email}
        />
        <FormField
          icon={<PhoneIcon />}
          placeholder="DDD + Celular"
          value={formData.phone}
          onChange={(v) => updateFormData({ phone: formatPhone(v) })}
          error={errors.phone}
          maxLength={15}
        />
      </div>

      <div className="mt-6">
        <p className="mb-3 text-sm font-semibold text-veloe-navy">
          Qual é o seu dispositivo?
        </p>
        <div className="grid grid-cols-2 gap-3">
          {(["iphone", "android"] as DeviceType[]).map((device) => (
            <button
              key={device}
              type="button"
              onClick={() => updateFormData({ deviceType: device })}
              className={`flex items-center justify-center gap-2 rounded-2xl border-2 px-4 py-3.5 text-sm font-semibold transition-all ${
                formData.deviceType === device
                  ? "border-veloe-cyan bg-veloe-cyan/10 text-veloe-navy"
                  : "border-gray-200 bg-white text-veloe-navy/70 hover:border-veloe-cyan/50"
              }`}
            >
              {device === "iphone" ? <AppleIcon /> : <AndroidIcon />}
              {device === "iphone" ? "iPhone" : "Android"}
            </button>
          ))}
        </div>
        {errors.deviceType && (
          <p className="mt-1.5 text-xs text-red-500">{errors.deviceType}</p>
        )}
      </div>

      <label className="mt-5 flex cursor-pointer items-start gap-3">
        <input
          type="checkbox"
          checked={formData.marketingOptIn}
          onChange={(e) =>
            updateFormData({ marketingOptIn: e.target.checked })
          }
          className="mt-0.5 h-4 w-4 shrink-0 rounded border-gray-300 accent-veloe-cyan"
        />
        <span className="text-xs leading-relaxed text-veloe-navy/70 sm:text-sm">
          Desejo receber mensagens sobre promoções, descontos e benefícios por
          SMS, e-mail ou WhatsApp.
        </span>
      </label>

      <button
        type="button"
        onClick={handleSubmit}
        disabled={!isFilled}
        className={`mt-8 w-full rounded-full py-4 text-base font-bold transition-all ${
          isFilled
            ? "bg-veloe-navy text-white shadow-[0_4px_16px_rgba(29,27,132,0.3)] hover:bg-veloe-navy-dark"
            : "cursor-not-allowed bg-[#e1e1eb] text-gray-400"
        }`}
      >
        Informe os dados
      </button>
    </div>
  );
}

function PersonIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 20c0-4 3.5-6 7-6s7 2 7 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function DocumentIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h6M9 16h4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="18" height="13" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M3 8l9 6 9-6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function PhoneIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M6.5 4h3l1.5 4-2 1.5a11 11 0 005 5L17.5 13l4 1.5v3a1.5 1.5 0 01-1.5 1.5C9.5 19 5 14.5 5 8.5A1.5 1.5 0 016.5 4z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.05 20.28c-.98.95-2.05.88-3.08.4-1.09-.5-2.08-.48-3.24 0-1.44.62-2.2.44-3.06-.4C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09l.01-.01zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
    </svg>
  );
}

function AndroidIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.6 9.48l1.84-3.18c.16-.31-.04-.68-.38-.68H15.3l-1.3 2.26A6.93 6.93 0 0012 8c-1.01 0-1.97.22-2.83.6L7.87 6.62h-3.76c-.34 0-.54.37-.38.68L6.4 9.48A6.96 6.96 0 005 14v1a1 1 0 001 1h1v5a1 1 0 001 1h2a1 1 0 001-1v-4h4v4a1 1 0 001 1h2a1 1 0 001-1v-5h1a1 1 0 001-1v-1c0-1.68-.57-3.23-1.52-4.52zM9 12.5a1 1 0 110-2 1 1 0 010 2zm6 0a1 1 0 110-2 1 1 0 010 2z" />
    </svg>
  );
}
