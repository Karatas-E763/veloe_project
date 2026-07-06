export default function SecurityFooter() {
  return (
    <div className="mt-auto border-t border-gray-100 px-4 py-6 sm:px-6">
      <div className="mx-auto flex max-w-lg items-center justify-center gap-2 text-center text-xs text-veloe-navy/70 sm:text-sm">
        <ShieldIcon />
        <p>
          Seus dados estão{" "}
          <span className="font-semibold text-veloe-cyan">protegidos</span> com
          segurança e criptografia.
        </p>
      </div>
    </div>
  );
}

function ShieldIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      className="shrink-0"
    >
      <path
        d="M12 2l8 4v6c0 5.25-3.5 10-8 12-4.5-2-8-6.75-8-12V6l8-4z"
        stroke="#26d0e0"
        strokeWidth="1.5"
        fill="none"
      />
      <path
        d="M9 12l2 2 4-4"
        stroke="#26d0e0"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
