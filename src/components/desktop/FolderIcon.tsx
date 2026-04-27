import { useState } from "react";

interface Props {
  label: string;
  onOpen: () => void;
}

export function FolderIcon({ label, onOpen }: Props) {
  const [selected, setSelected] = useState(false);

  return (
    <button
      onDoubleClick={onOpen}
      onClick={() => setSelected(true)}
      onBlur={() => setSelected(false)}
      className={`group flex w-24 flex-col items-center gap-1 rounded-md p-2 text-center outline-none transition ${
        selected ? "bg-white/20 ring-1 ring-white/30" : "hover:bg-white/10"
      }`}
    >
      <svg
        viewBox="0 0 64 52"
        className="h-14 w-16 drop-shadow-[0_2px_4px_rgba(0,0,0,0.45)]"
        aria-hidden
      >
        <defs>
          <linearGradient id="folderTab" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFD27A" />
            <stop offset="100%" stopColor="#F5A623" />
          </linearGradient>
          <linearGradient id="folderBody" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#FFCB5B" />
            <stop offset="100%" stopColor="#E89A14" />
          </linearGradient>
        </defs>
        <path d="M2 10 Q2 6 6 6 H22 L28 12 H58 Q62 12 62 16 V16 H2 Z" fill="url(#folderTab)" />
        <path d="M2 14 H62 Q62 14 62 18 V46 Q62 50 58 50 H6 Q2 50 2 46 Z" fill="url(#folderBody)" />
        <path d="M2 14 H62 V20 H2 Z" fill="rgba(255,255,255,0.18)" />
      </svg>
      <span className="max-w-full truncate text-xs font-medium text-white drop-shadow-[0_1px_2px_rgba(0,0,0,0.8)]">
        {label}
      </span>
    </button>
  );
}