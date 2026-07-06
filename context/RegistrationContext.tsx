"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import {
  initialFormData,
  type HomeTab,
  type RegistrationFormData,
} from "@/lib/types";

interface RegistrationContextValue {
  step: number;
  subStep: number;
  formData: RegistrationFormData;
  registrationId: string | null;
  setStep: (step: number) => void;
  setSubStep: (subStep: number) => void;
  updateFormData: (data: Partial<RegistrationFormData>) => void;
  setRegistrationId: (id: string) => void;
  resetForm: () => void;
  homeTab: HomeTab;
  setHomeTab: (tab: HomeTab) => void;
}

const RegistrationContext = createContext<RegistrationContextValue | null>(null);

export function RegistrationProvider({ children }: { children: ReactNode }) {
  const [step, setStep] = useState(1);
  const [subStep, setSubStep] = useState(1);
  const [formData, setFormData] = useState<RegistrationFormData>(initialFormData);
  const [registrationId, setRegistrationId] = useState<string | null>(null);
  const [homeTab, setHomeTab] = useState<HomeTab>("pessoa-fisica");

  useEffect(() => {
    const stored = sessionStorage.getItem("veloe-home-tab") as HomeTab | null;
    if (stored && ["pessoa-fisica", "pessoa-juridica", "parcerias"].includes(stored)) {
      setHomeTab(stored);
    }
  }, []);

  const updateFormData = useCallback((data: Partial<RegistrationFormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetForm = useCallback(() => {
    setStep(1);
    setSubStep(1);
    setFormData(initialFormData);
    setRegistrationId(null);
  }, []);

  const value = useMemo(
    () => ({
      step,
      subStep,
      formData,
      registrationId,
      setStep,
      setSubStep,
      updateFormData,
      setRegistrationId,
      resetForm,
      homeTab,
      setHomeTab,
    }),
    [step, subStep, formData, registrationId, updateFormData, resetForm, homeTab]
  );

  return (
    <RegistrationContext.Provider value={value}>
      {children}
    </RegistrationContext.Provider>
  );
}

export function useRegistration() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistration must be used within RegistrationProvider");
  }
  return context;
}
