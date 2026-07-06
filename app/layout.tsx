import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import SiteFooter from "@/components/SiteFooter";
import "./globals.css";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-montserrat",
});

export const metadata: Metadata = {
  title: "Veloe - Até 2 TAGs gratuitas para você!",
  description:
    "Clientes dos bancos parceiros têm até 2 TAGs Veloe sem custo. Sem mensalidade, sem taxa de adesão.",
  icons: {
    icon: "/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="pt-BR">
      <body className={`${montserrat.variable} flex min-h-screen flex-col antialiased`}>
        <div className="flex-1">{children}</div>
        <SiteFooter />
      </body>
    </html>
  );
}
