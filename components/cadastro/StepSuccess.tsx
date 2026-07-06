"use client";

import Link from "next/link";
import { useRegistration } from "@/context/RegistrationContext";

export default function StepSuccess() {
  const { resetForm } = useRegistration();

  return (
    <div className="animate-fade-in text-center">
      <div className="relative mx-auto mb-6 flex h-24 w-24 items-center justify-center">
        <ConfettiDecor />
        <div className="relative flex h-20 w-20 items-center justify-center rounded-full bg-[#82c91e] shadow-[0_8px_24px_rgba(130,201,30,0.4)]">
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <path
              d="M6 12l4 4 8-8"
              stroke="white"
              strokeWidth="3"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
      </div>

      <h1 className="text-2xl font-bold text-veloe-navy sm:text-[1.75rem]">
        Cadastro concluído!
      </h1>

      <p className="mt-3 text-sm leading-relaxed text-veloe-navy/70 sm:text-[15px]">
        Um de nossos atendentes irá entrar em contato em até{" "}
        <span className="font-bold text-veloe-cyan">24 horas</span> para
        ativação da sua TAG Veloe.
      </p>
      <p className="mt-2 text-sm text-veloe-navy/70">
        Obrigado por utilizar nossos serviços!
      </p>

      <div className="mt-8 rounded-2xl bg-[#eef0f8] p-5 text-left sm:p-6">
        <h2 className="font-bold text-veloe-navy">O que acontece agora?</h2>
        <ul className="mt-4 space-y-4">
          <NextStepItem
            icon={<DocIcon />}
            text="Seu cadastro foi recebido com sucesso. Estamos analisando suas informações."
          />
          <NextStepItem
            icon={<HeadsetIcon />}
            text={
              <>
                Em até <span className="font-bold text-veloe-cyan">24 horas</span>, nossos
                atendentes entrarão em contato para ativar sua TAG.
              </>
            }
          />
          <NextStepItem
            icon={<TagIcon />}
            text="Após a ativação, sua TAG estará pronta para uso em pedágios e estacionamentos."
          />
        </ul>
      </div>

      <Link
        href="/"
        onClick={resetForm}
        className="mt-8 inline-flex w-full items-center justify-center gap-2 rounded-full bg-veloe-navy py-4 text-base font-bold text-white shadow-[0_4px_16px_rgba(29,27,132,0.3)] transition-all hover:bg-veloe-navy-dark"
      >
        <HomeIcon />
        Voltar para o início
      </Link>
    </div>
  );
}

function NextStepItem({
  icon,
  text,
}: {
  icon: React.ReactNode;
  text: React.ReactNode;
}) {
  return (
    <li className="flex items-start gap-3">
      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white">
        {icon}
      </div>
      <p className="text-sm leading-relaxed text-veloe-navy/80">{text}</p>
    </li>
  );
}

function ConfettiDecor() {
  return (
    <>
      <span className="absolute -left-2 top-2 h-2 w-2 rounded-full bg-veloe-cyan" />
      <span className="absolute -right-1 top-4 h-1.5 w-1.5 rounded-full bg-purple-400" />
      <span className="absolute right-0 top-0 h-2 w-2 rounded-full bg-[#82c91e]" />
      <span className="absolute -bottom-1 left-4 h-1.5 w-1.5 rounded-full bg-veloe-cyan" />
      <span className="absolute bottom-2 -right-2 h-1 w-3 rotate-45 rounded-full bg-purple-300" />
      <span className="absolute -left-3 bottom-4 h-1 w-2 -rotate-12 rounded-full bg-[#82c91e]" />
    </>
  );
}

function DocIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="5" y="3" width="14" height="18" rx="2" stroke="#7c3aed" strokeWidth="1.5" />
      <path d="M9 8h6M9 12h4M9 16h5" stroke="#7c3aed" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function HeadsetIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M4 14v-2a8 8 0 0116 0v2M4 14a2 2 0 002 2h1v-4H5a1 1 0 00-1 1zM20 14a2 2 0 01-2 2h-1v-4h2a1 1 0 011 1z" stroke="#1d1b84" strokeWidth="1.5" />
    </svg>
  );
}

function TagIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <rect x="3" y="6" width="12" height="8" rx="1" fill="#1d1b84" />
      <text x="5" y="12" fill="#26d0e0" fontSize="5" fontWeight="700">v</text>
    </svg>
  );
}

function HomeIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <path d="M4 10.5L12 4l8 6.5V20a1 1 0 01-1 1h-5v-6H10v6H5a1 1 0 01-1-1v-9.5z" stroke="#26d0e0" strokeWidth="1.5" strokeLinejoin="round" />
    </svg>
  );
}
