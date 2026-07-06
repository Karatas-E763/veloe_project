"use client";

import { useCallback } from "react";
import RegistrationLayout from "@/components/cadastro/RegistrationLayout";
import StepDelivery from "@/components/cadastro/StepDelivery";
import StepPersonalData from "@/components/cadastro/StepPersonalData";
import StepStickers from "@/components/cadastro/StepStickers";
import StepSuccess from "@/components/cadastro/StepSuccess";
import StepVehicle from "@/components/cadastro/StepVehicle";
import { useRegistration } from "@/context/RegistrationContext";
import type { Registration } from "@/lib/types";

async function saveToArchive(
  formData: ReturnType<typeof useRegistration>["formData"],
  registrationId: string | null,
  homeTab: ReturnType<typeof useRegistration>["homeTab"]
): Promise<string> {
  const payload: Partial<Registration> = {
    id: registrationId ?? undefined,
    fullName: formData.fullName,
    cpf: formData.cpf,
    birthDate: formData.birthDate,
    email: formData.email,
    phone: formData.phone,
    deviceType: formData.deviceType as Registration["deviceType"],
    marketingOptIn: formData.marketingOptIn,
    deliveryChoice: formData.deliveryChoice as Registration["deliveryChoice"],
    stickerCount: formData.stickerCount,
    licensePlate: formData.licensePlate,
    vehicleType: formData.vehicleType as Registration["vehicleType"],
    homeTab,
  };

  const response = await fetch("/api/registrations", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!response.ok) throw new Error("Failed to save");

  const saved = (await response.json()) as Registration;
  return saved.id;
}

export default function CadastroPage() {
  const {
    step,
    subStep,
    setStep,
    setSubStep,
    formData,
    registrationId,
    setRegistrationId,
    homeTab,
  } = useRegistration();

  const goToStep = useCallback(
    (nextStep: number, nextSubStep = 1) => {
      setStep(nextStep);
      setSubStep(nextSubStep);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [setStep, setSubStep]
  );

  const handlePersonalDataNext = () => goToStep(2);

  const handleDeliveryNext = () => goToStep(3);

  const handleStickersNext = () => goToStep(4, 1);

  const handleVehicleNext = async () => {
    try {
      const id = await saveToArchive(formData, registrationId, homeTab);
      setRegistrationId(id);
      goToStep(4, 2);
    } catch {
      alert("Erro ao salvar cadastro. Tente novamente.");
    }
  };

  const renderStep = () => {
    if (step === 1) {
      return <StepPersonalData onNext={handlePersonalDataNext} />;
    }
    if (step === 2) {
      return <StepDelivery onNext={handleDeliveryNext} />;
    }
    if (step === 3) {
      return <StepStickers onNext={handleStickersNext} />;
    }
    if (step === 4 && subStep === 1) {
      return <StepVehicle onNext={handleVehicleNext} />;
    }
    if (step === 4 && subStep === 2) {
      return <StepSuccess />;
    }
    return <StepPersonalData onNext={handlePersonalDataNext} />;
  };

  return (
    <RegistrationLayout
      currentStep={step}
      showBack={step === 4 && subStep === 1}
      onBack={() => goToStep(3)}
    >
      {renderStep()}
    </RegistrationLayout>
  );
}
