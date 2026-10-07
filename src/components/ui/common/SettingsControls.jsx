import {  FaChevronDown, FaChevronUp } from "react-icons/fa";

export function Toggle({ checked, onChange }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-10 rounded-full transition ${checked ? "bg-[#a9bf65]" : "bg-[#777777]"}`}
    >
      <span
        className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition-all ${
          checked ? "left-5" : "left-1"
        }`}
      />
    </button>
  );
}

export function SettingsSection({
    name,
    open,
    onClick,
    children,
    className= "",
}){

    return (
      <div className={className}>
        <button
          type="button"
          onClick={onClick}
          className="mt-4 flex items-center justify-between h-10 w-full rounded bg-[#555555]  text-sm font-semibold text-white outline-none px-2 mb-2"
        >
          <span>{name}</span>
          <span>{open ? <FaChevronUp /> : <FaChevronDown />}</span>
        </button>
        {open && (
          <div className="mt-1 space-y-1.5">
            {children}
            </div>
        )}
      </div>
    );
}


export function SettingsRow({
    label,
    children,
    className="",
}){
    return (
      <div
        className={`flex h-10 w-full items-center justify-between rounded bg-[#242323] px-3 text-sm text-white ${className}`}
      >
        <span>{label}</span>
        {children}
      </div>
    );

}

export function SliderField({
    label,
    value,
    onChange,
    step,
    min,
    max,
    decimals,
})
{

    const numericValue = Number(value);
    const safeValue = Number.isFinite(numericValue)
    ? Math.min(max, Math.max(min, numericValue))
    : min;

    const range = max- min || 1;

    const progress = ((safeValue-min)/range)* 100;

    const decimalPlaces = decimals ?? 
    (step >=1
        ? 0
        : 3
    )

    return (
      <div
        className="relative h-10 w-full overflow-hidden rounded bg-[#242323] select-none"
        title={`${label} :${safeValue.toFixed(decimalPlaces)}`}
      >
        <div
          className="pointer-events-none absolute inset-y-0 left-0 rounded-l bg-[#9aaa63]"
          style={{
            width: `${progress}%`,
          }}
        />
        <input
          type="range"
          aria-label={label}
          min={min}
          max={max}
          step={step}
          value={safeValue}
          onChange={(event) => onChange(Number(event.target.value))}
          className="absolute inset-0 z-20 m-0 h-full w-full cursor-pointer opacity-0"
        />
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-between px-2.5 text-sm font-medium text-white">
          <span className="truncate pr-3">{label}</span>
          <span className="min-w-[58px] text-right tabular-nums">
            {safeValue.toFixed(decimalPlaces)}
          </span>
        </div>
      </div>
    );
}

