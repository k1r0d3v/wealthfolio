import { ReactNode } from "react";

interface SolidBarProps {
  children: ReactNode;
  className?: string;
  style?: React.CSSProperties;
}

export function SolidBar({ children, className = "", style }: SolidBarProps) {
  return (
    <div
      className={`relative w-full overflow-hidden border-t ${className}`}
      style={{
        backgroundColor: 'var(--background)',
        borderColor: '',
        ...style,
      }}
    >
      <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-white/15" />
      <div className="relative z-10 w-full">{children}</div>
    </div>
  );
}
