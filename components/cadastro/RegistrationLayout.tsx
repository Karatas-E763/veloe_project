"use client";

import Link from "next/link";
import { VeloeLogoCyan } from "@/components/shared/VeloeLogo";
import ProgressStepper from "./ProgressStepper";
import SecurityFooter from "./SecurityFooter";

export default function RegistrationLayout({
  currentStep,
  showBack = false,
  onBack,
  children,
}: {
  currentStep: number;
  showBack?: boolean;
  onBack?: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col bg-[#f5f7fa]">
      <header className="relative bg-veloe-navy px-4 py-4 sm:px-6">
        <div className="mx-auto flex max-w-lg items-center justify-center">
          {showBack && onBack && (
            <button
              type="button"
              onClick={onBack}
              className="absolute left-4 flex h-9 w-9 items-center justify-center text-white sm:left-6"
              aria-label="Voltar"
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path
                  d="M15 18l-6-6 6-6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          )}
          <Link href="/" aria-label="Voltar para o início">
            <VeloeLogoCyan className="h-7" />
          </Link>
        </div>
      </header>

      <ProgressStepper currentStep={currentStep} />

      <main className="flex flex-1 flex-col px-4 py-6 sm:px-6 sm:py-8">
        <div className="mx-auto w-full max-w-lg flex-1">{children}</div>
      </main>

      <SecurityFooter />
    </div>
  );
}
