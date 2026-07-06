"use client";

import { useState } from "react";
import { useHomeTab, navTabs } from "@/context/HomeTabContext";
import { VeloeLogoNavy } from "@/components/shared/VeloeLogo";

export default function Header() {
  const { activeTab, setActiveTab } = useHomeTab();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-gray-100/80 bg-white/95 backdrop-blur-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-3 px-4 py-3 sm:px-6 md:px-8 md:py-4">
        <div className="flex min-w-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            className="flex h-9 w-9 shrink-0 items-center justify-center text-veloe-navy lg:hidden"
            aria-label="Abrir menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              <path
                d="M3 6h18M3 12h18M3 18h18"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </button>

          <a href="/" className="shrink-0">
            <VeloeLogoNavy />
          </a>
        </div>

        <nav className="hidden items-center gap-4 lg:flex xl:gap-10">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
              className={`whitespace-nowrap text-sm font-semibold transition-all duration-300 xl:text-[15px] ${
                activeTab === tab.id
                  ? "border-b-[3px] border-veloe-navy pb-0.5 text-veloe-navy"
                  : "text-veloe-navy/60 hover:text-veloe-navy"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </nav>

        <a
          href="/cadastro"
          onClick={() => sessionStorage.setItem("veloe-home-tab", activeTab)}
          className="shrink-0 rounded-full bg-veloe-navy px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-veloe-navy-dark sm:px-5 sm:py-2.5 sm:text-sm md:px-7 md:py-3 md:text-base"
        >
          Quero agora
        </a>
      </div>

      {menuOpen && (
        <nav className="border-t border-gray-100 bg-white px-4 py-3 lg:hidden">
          {navTabs.map((tab) => (
            <button
              key={tab.id}
              type="button"
              className={`block w-full border-b border-gray-50 py-3 text-left text-[15px] font-semibold last:border-0 ${
                activeTab === tab.id ? "text-veloe-navy" : "text-veloe-navy/70"
              }`}
              onClick={() => {
                setActiveTab(tab.id);
                setMenuOpen(false);
              }}
            >
              {tab.label}
            </button>
          ))}
        </nav>
      )}
    </header>
  );
}
