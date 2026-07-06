import { RegistrationProvider } from "@/context/RegistrationContext";

export default function CadastroLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <RegistrationProvider>{children}</RegistrationProvider>;
}
