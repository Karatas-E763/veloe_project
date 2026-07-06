const steps = [
  { number: 1, label: "Seus dados" },
  { number: 2, label: "Entrega" },
  { number: 3, label: "Adesivos" },
  { number: 4, label: "Confirmação" },
];

export default function ProgressStepper({ currentStep }: { currentStep: number }) {
  return (
    <div className="border-b border-gray-100 bg-white px-4 py-5 sm:px-6">
      <div className="mx-auto flex max-w-lg items-start justify-between">
        {steps.map((step, index) => {
          const isCompleted = currentStep > step.number;
          const isActive = currentStep === step.number;

          return (
            <div key={step.number} className="relative flex flex-1 flex-col items-center">
              {index < steps.length - 1 && (
                <div
                  className={`absolute left-[calc(50%+16px)] top-4 h-[2px] w-[calc(100%-32px)] ${
                    isCompleted ? "bg-veloe-cyan" : "bg-gray-200"
                  }`}
                />
              )}

              <div
                className={`relative z-10 flex h-8 w-8 items-center justify-center rounded-full text-sm font-bold transition-all duration-300 ${
                  isActive
                    ? "bg-veloe-cyan text-white shadow-[0_4px_12px_rgba(38,208,224,0.4)]"
                    : isCompleted
                      ? "border-2 border-veloe-cyan bg-white text-veloe-cyan"
                      : "border-2 border-gray-200 bg-white text-gray-400"
                }`}
              >
                {step.number}
              </div>

              <span
                className={`mt-2 text-center text-[11px] leading-tight sm:text-xs ${
                  isActive
                    ? "font-bold text-veloe-navy"
                    : "font-medium text-veloe-navy/50"
                }`}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
