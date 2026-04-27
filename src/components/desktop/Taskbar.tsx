interface Props {
  terminalOpen: boolean;
  terminalMinimized: boolean;
  onTerminalClick: () => void;
}

export function Taskbar({ terminalOpen, terminalMinimized, onTerminalClick }: Props) {
  const [time, setTime] = useTime();
  void setTime;

  return (
    <div
      className="absolute bottom-0 left-0 right-0 z-50 flex h-12 items-center justify-center gap-2 border-t border-[var(--taskbar-border)] backdrop-blur-xl"
      style={{ background: "var(--taskbar-bg)" }}
    >
      <div className="absolute left-0 flex h-full items-center pl-3">
        {/* spacer */}
      </div>

      <button
        className="flex h-10 w-10 items-center justify-center rounded-md transition hover:bg-white/10"
        aria-label="Start"
      >
        <svg viewBox="0 0 24 24" className="h-5 w-5">
          <rect x="3" y="3" width="8" height="8" fill="#76b9ed" />
          <rect x="13" y="3" width="8" height="8" fill="#76b9ed" />
          <rect x="3" y="13" width="8" height="8" fill="#76b9ed" />
          <rect x="13" y="13" width="8" height="8" fill="#76b9ed" />
        </svg>
      </button>

      {terminalOpen && (
        <button
          onClick={onTerminalClick}
          className={`flex h-10 items-center gap-2 rounded-md px-3 transition hover:bg-white/10 ${
            !terminalMinimized ? "bg-white/15 border-b-2 border-blue-400" : ""
          }`}
        >
          <TerminalGlyph />
          <span className="text-xs text-white">Terminal</span>
        </button>
      )}

      <div className="absolute right-3 flex items-center gap-2 text-xs text-white/90">
        <Clock />
      </div>
    </div>
  );
}

function TerminalGlyph() {
  return (
    <svg viewBox="0 0 20 20" className="h-4 w-4 text-white">
      <rect x="1" y="3" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
      <path d="M5 8 L8 10 L5 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <line x1="10" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

import { useEffect, useState } from "react";

function useTime(): [Date, (d: Date) => void] {
  const [t, setT] = useState(new Date());
  useEffect(() => {
    const i = setInterval(() => setT(new Date()), 30000);
    return () => clearInterval(i);
  }, []);
  return [t, setT];
}

function Clock() {
  const [t] = useTime();
  const time = t.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const date = t.toLocaleDateString([], { month: "numeric", day: "numeric", year: "numeric" });
  return (
    <div className="flex flex-col items-end leading-tight">
      <span>{time}</span>
      <span>{date}</span>
    </div>
  );
}