import Image from "next/image";

const banks = [
  { name: "Bradesco", logo: "/images/bradesco.png" },
  { name: "Itaú", logo: "/images/itau.png" },
  { name: "Santander", logo: "/images/santander.png" },
  { name: "C6 Bank", logo: "/images/c6bank.png" },
  { name: "Sicredi", logo: "/images/sicredi.png" },
  { name: "Banco do Brasil", logo: "/images/bb.png" },
];

export default function PartnerBanksSection() {
  return (
    <section className="px-4 py-8 sm:px-6 sm:py-10 md:px-8 md:py-12">
      <div className="mx-auto max-w-5xl rounded-[28px] bg-white px-5 py-8 shadow-[0_4px_32px_rgba(29,27,132,0.08)] sm:rounded-[32px] sm:px-8 sm:py-10 md:px-12 md:py-12">
        <h2 className="text-center text-lg font-bold text-veloe-navy sm:text-xl md:text-2xl">
          Bancos parceiros Veloe
        </h2>

        <div className="mt-7 flex flex-wrap items-center justify-center gap-x-8 gap-y-6 sm:mt-8 sm:gap-x-10 md:mt-10 lg:justify-between lg:gap-6">
          {banks.map((bank) => (
            <div
              key={bank.name}
              className="flex h-12 w-[120px] items-center justify-center sm:h-14 sm:w-[140px] md:h-16 md:w-[160px]"
            >
              <Image
                src={bank.logo}
                alt={bank.name}
                width={320}
                height={120}
                quality={100}
                className="h-full w-full object-contain object-center"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
