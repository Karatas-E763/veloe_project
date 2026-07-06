"use client";

import { useMemo, useState } from "react";
import { useRegistration } from "@/context/RegistrationContext";
import {
  formatCPF,
  formatPhone,
  isPersonalDataFilled,
  validateBirthDate,
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

function formatBirthDateDisplay(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return "";
  const [year, month, day] = iso.split("-");
  return `${day}/${month}/${year}`;
}

function toBirthDateIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const WEEKDAYS = ["D", "S", "T", "Q", "Q", "S", "S"];
const MONTHS = [
  "janeiro",
  "fevereiro",
  "março",
  "abril",
  "maio",
  "junho",
  "julho",
  "agosto",
  "setembro",
  "outubro",
  "novembro",
  "dezembro",
];

function BirthDateField({
  value,
  onChange,
  error,
}: {
  value: string;
  onChange: (value: string) => void;
  error?: string;
}) {
  const [open, setOpen] = useState(false);
  const parsed = value ? new Date(`${value}T12:00:00`) : null;
  const [viewYear, setViewYear] = useState(parsed?.getFullYear() ?? new Date().getFullYear());
  const [viewMonth, setViewMonth] = useState(parsed?.getMonth() ?? new Date().getMonth());
  const [pendingDay, setPendingDay] = useState<number | null>(parsed?.getDate() ?? null);

  const openPicker = () => {
    const base = value ? new Date(`${value}T12:00:00`) : new Date();
    setViewYear(base.getFullYear());
    setViewMonth(base.getMonth());
    setPendingDay(value ? base.getDate() : null);
    setOpen(true);
  };

  const pendingDate =
    pendingDay !== null
      ? new Date(viewYear, viewMonth, pendingDay, 12, 0, 0)
      : null;

  const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
  const firstWeekday = new Date(viewYear, viewMonth, 1).getDay();

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
      return;
    }
    setViewMonth((m) => m - 1);
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
      return;
    }
    setViewMonth((m) => m + 1);
  };

  const confirmDate = () => {
    if (pendingDay === null) return;
    onChange(toBirthDateIso(viewYear, viewMonth, pendingDay));
    setOpen(false);
  };

  return (
    <div>
      <button
        type="button"
        onClick={openPicker}
        className={`flex w-full items-center gap-3 rounded-2xl border bg-white px-4 py-3.5 text-left transition-colors ${
          error ? "border-red-300" : "border-gray-200 focus-within:border-veloe-cyan"
        }`}
      >
        <span className="shrink-0 text-veloe-navy/40">
          <CalendarIcon />
        </span>
        <span
          className={`w-full text-[15px] outline-none ${
            value ? "text-veloe-navy" : "text-gray-400"
          }`}
        >
          {value ? formatBirthDateDisplay(value) : "Data de nascimento"}
        </span>
      </button>
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}

      {open && (
        <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center">
          <div
            role="dialog"
            aria-modal="true"
            aria-label="Selecionar data de nascimento"
            className="w-full max-w-sm overflow-hidden rounded-t-2xl bg-white shadow-xl sm:rounded-2xl"
          >
            <div className="bg-veloe-navy px-4 py-4 text-white">
              <p className="text-sm font-medium opacity-90">{viewYear}</p>
              <p className="text-xl font-bold">
                {pendingDate
                  ? pendingDate.toLocaleDateString("pt-BR", {
                      weekday: "short",
                      day: "numeric",
                      month: "short",
                    })
                  : "Selecione a data"}
              </p>
            </div>

            <div className="px-3 py-3">
              <div className="mb-3 flex items-center justify-between">
                <button
                  type="button"
                  onClick={prevMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-veloe-navy/60 hover:bg-gray-100"
                  aria-label="Mês anterior"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M15 18l-6-6 6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
                <p className="text-sm font-semibold capitalize text-veloe-navy">
                  {MONTHS[viewMonth]} de {viewYear}
                </p>
                <button
                  type="button"
                  onClick={nextMonth}
                  className="flex h-8 w-8 items-center justify-center rounded-full text-veloe-navy/60 hover:bg-gray-100"
                  aria-label="Próximo mês"
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M9 18l6-6-6-6"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </button>
              </div>

              <div className="grid grid-cols-7 gap-1 text-center">
                {WEEKDAYS.map((day, index) => (
                  <span
                    key={`${day}-${index}`}
                    className="py-1 text-[11px] font-semibold text-veloe-navy/45"
                  >
                    {day}
                  </span>
                ))}
                {Array.from({ length: firstWeekday }).map((_, index) => (
                  <span key={`empty-${index}`} />
                ))}
                {Array.from({ length: daysInMonth }).map((_, index) => {
                  const day = index + 1;
                  const selected = pendingDay === day;
                  return (
                    <button
                      key={day}
                      type="button"
                      onClick={() => setPendingDay(day)}
                      className={`mx-auto flex h-9 w-9 items-center justify-center rounded-full text-sm font-medium transition-colors ${
                        selected
                          ? "bg-veloe-navy text-white"
                          : "text-veloe-navy hover:bg-veloe-cyan/10"
                      }`}
                    >
                      {day}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex flex-row flex-nowrap items-center justify-end gap-0 border-t border-gray-100 px-1 py-1">
              <button
                type="button"
                onClick={confirmDate}
                disabled={pendingDay === null}
                className="px-2 py-1 text-[13px] font-semibold text-veloe-navy disabled:opacity-40"
              >
                Definir
              </button>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="px-2 py-1 text-[13px] font-semibold text-veloe-navy"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={() => {
                  onChange("");
                  setPendingDay(null);
                  setOpen(false);
                }}
                className="px-2 py-1 text-[13px] font-semibold text-veloe-navy"
              >
                Limpar
              </button>
            </div>
          </div>
        </div>
      )}
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
    if (touched.birthDate && !validateBirthDate(formData.birthDate)) {
      e.birthDate = "Data inválida (mínimo 18 anos)";
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
      birthDate: true,
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
        <BirthDateField
          value={formData.birthDate}
          onChange={(v) => updateFormData({ birthDate: v })}
          error={errors.birthDate}
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

function CalendarIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <rect x="4" y="5" width="16" height="16" rx="2" stroke="currentColor" strokeWidth="1.5" />
      <path d="M4 10h16M8 3v4M16 3v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
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
