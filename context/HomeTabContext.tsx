"use client";

import { createContext, useContext, useState, type ReactNode } from "react";
import type { HomeTab } from "@/lib/types";

interface HomeTabContextValue {
  activeTab: HomeTab;
  setActiveTab: (tab: HomeTab) => void;
}

const HomeTabContext = createContext<HomeTabContextValue | null>(null);

export function HomeTabProvider({ children }: { children: ReactNode }) {
  const [activeTab, setActiveTab] = useState<HomeTab>("pessoa-fisica");

  return (
    <HomeTabContext.Provider value={{ activeTab, setActiveTab }}>
      {children}
    </HomeTabContext.Provider>
  );
}

export function useHomeTab() {
  const context = useContext(HomeTabContext);
  if (!context) {
    throw new Error("useHomeTab must be used within HomeTabProvider");
  }
  return context;
}

export const heroContent: Record<
  HomeTab,
  {
    title: React.ReactNode;
    subtitle: string;
    image: string;
    checklist: string[];
  }
> = {
  "pessoa-fisica": {
    title: (
      <>
        Até 2 TAGs Veloe{" "}
        <span className="text-veloe-cyan">gratuitas</span> para você!
      </>
    ),
    subtitle:
      "Clientes dos bancos parceiros têm até 2 TAGs Veloe sem custo.",
    image: "/images/hero.jpg",
    checklist: [
      "Sem mensalidade",
      "Sem taxa de adesão",
      "Aceita em todos os pedágios e estacionamentos do país",
    ],
  },
  "pessoa-juridica": {
    title: (
      <>
        TAGs Veloe para sua{" "}
        <span className="text-veloe-cyan">empresa</span> sem custo!
      </>
    ),
    subtitle:
      "Soluções corporativas para frotas com gestão centralizada e economia.",
    image: "/images/hero-pj.jpg",
    checklist: [
      "Gestão de frota integrada",
      "Sem taxa de adesão para CNPJ",
      "Relatórios e controle pelo portal empresarial",
    ],
  },
  parcerias: {
    title: (
      <>
        Seja um{" "}
        <span className="text-veloe-cyan">parceiro</span> Veloe!
      </>
    ),
    subtitle:
      "Conecte seu negócio à maior rede de pedágios e estacionamentos do Brasil.",
    image: "/images/hero-parcerias.jpg",
    checklist: [
      "Programa de indicação exclusivo",
      "Comissões atrativas",
      "Suporte dedicado para parceiros",
    ],
  },
};

export const navTabs: { id: HomeTab; label: string }[] = [
  { id: "pessoa-fisica", label: "Pessoa Física" },
  { id: "pessoa-juridica", label: "Pessoa Jurídica" },
  { id: "parcerias", label: "Parcerias" },
];
