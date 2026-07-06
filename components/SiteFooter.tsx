import { VeloeLogoCyan } from "@/components/shared/VeloeLogo";

export default function SiteFooter() {
  return (
    <footer className="bg-veloe-navy px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-6xl">
        <VeloeLogoCyan className="h-6 sm:h-7" />

        <div className="mt-6 space-y-1 sm:mt-8">
          <p className="text-[13px] font-semibold leading-snug text-white sm:text-sm">
            TAG TECNOLOGIA PARA O SISTEMA FINANCEIRO S.A.
          </p>
          <p className="text-[13px] font-medium text-veloe-cyan sm:text-sm">
            CNPJ 31.345.107/0001-03
          </p>
        </div>

        <div className="mt-6 border-t border-white/10 pt-6 sm:mt-8">
          <p className="text-[11px] font-semibold uppercase tracking-wide text-white/50 sm:text-xs">
            Endereço oficial
          </p>
          <address className="mt-3 space-y-1 not-italic text-[13px] leading-relaxed text-white/75 sm:text-sm">
            <p>
              Alameda Xingu, 512, Edifício Evolution, 3º, 4º e 20º andares
            </p>
            <p>Bairro: Alphaville Industrial</p>
            <p>Cidade: Barueri, SP</p>
            <p>CEP: 06455-030</p>
          </address>
        </div>
      </div>
    </footer>
  );
}
