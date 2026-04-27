import { useEffect, useRef, useState, useCallback } from "react";

interface Props {
  open: boolean;
  minimized: boolean;
  zIndex: number;
  onClose: () => void;
  onMinimize: () => void;
  onFocus: () => void;
}

const BANNER = String.raw`▓█████▄ ▓█████ ▒██   ██▒ ▄▄▄▄    ██▓ ███▄    █ 
▒██▀ ██▌▓█   ▀ ▒▒ █ █ ▒░▓█████▄ ▓██▒ ██ ▀█   █ 
░██   █▌▒███   ░░  █   ░▒██▒ ▄██▒██▒▓██  ▀█ ██▒
░▓█▄   ▌▒▓█  ▄  ░ █ █ ▒ ▒██░█▀  ░██░▓██▒  ▐▌██▒
░▒████▓ ░▒████▒▒██▒ ▒██▒░▓█  ▀█▓░██░▒██░   ▓██░
 ▒▒▓  ▒ ░░ ▒░ ░▒▒ ░ ░▓ ░░▒▓███▀▒░▓  ░ ▒░   ▒ ▒ 
 ░ ▒  ▒  ░ ░  ░░░   ░▒ ░▒░▒   ░  ▒ ░░ ░░   ░ ▒░
 ░ ░  ░    ░    ░    ░   ░    ░  ▒ ░   ░   ░ ░ 
   ░       ░  ░ ░    ░   ░       ░           ░ 
 ░                            ░                `;

type Line = { text: string; color?: string };
type Stage =
  | "banner"
  | "askWebhook"
  | "validating"
  | "confirm"
  | "askVictim"
  | "searching"
  | "sending"
  | "done"
  | "error";

export function TerminalWindow({ open, minimized, zIndex, onClose, onMinimize, onFocus }: Props) {
  const [maximized, setMaximized] = useState(false);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  const [initialized, setInitialized] = useState(false);
  const winRef = useRef<HTMLDivElement>(null);
  const drag = useRef<{ ox: number; oy: number; sx: number; sy: number } | null>(null);

  // Center on first open
  useEffect(() => {
    if (open && !initialized) {
      const w = 760, h = 480;
      setPos({ x: Math.max(20, (window.innerWidth - w) / 2), y: Math.max(20, (window.innerHeight - h - 48) / 2) });
      setInitialized(true);
    }
  }, [open, initialized]);

  const onMouseDownTitle = (e: React.MouseEvent) => {
    if (maximized) return;
    drag.current = { ox: e.clientX, oy: e.clientY, sx: pos.x, sy: pos.y };
    onFocus();
    const move = (ev: MouseEvent) => {
      if (!drag.current) return;
      setPos({ x: drag.current.sx + ev.clientX - drag.current.ox, y: Math.max(0, drag.current.sy + ev.clientY - drag.current.oy) });
    };
    const up = () => {
      drag.current = null;
      window.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
    window.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
  };

  if (!open) return null;

  const style: React.CSSProperties = maximized
    ? { top: 0, left: 0, width: "100vw", height: "calc(100vh - 48px)", borderRadius: 0, zIndex }
    : { top: pos.y, left: pos.x, width: 760, height: 480, zIndex };

  return (
    <div
      ref={winRef}
      onMouseDown={onFocus}
      className={`absolute flex flex-col overflow-hidden border ${minimized ? "hidden" : ""} animate-window-open`}
      style={{
        ...style,
        background: "var(--window-bg)",
        borderColor: "var(--window-border)",
        borderRadius: maximized ? 0 : 10,
        boxShadow: "var(--shadow-window)",
      }}
    >
      {/* Title bar */}
      <div
        onMouseDown={onMouseDownTitle}
        onDoubleClick={() => setMaximized((m) => !m)}
        className="flex h-9 items-center justify-between pl-3 pr-0 select-none"
        style={{ background: "var(--window-chrome)" }}
      >
        <div className="flex items-center gap-2 text-xs text-white/85">
          <svg viewBox="0 0 20 20" className="h-3.5 w-3.5">
            <rect x="1" y="3" width="18" height="14" rx="2" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <path d="M5 8 L8 10 L5 12" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="10" y1="13" x2="14" y2="13" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          Terminal
        </div>
        <div className="flex h-9">
          <WinBtn onClick={(e) => { e.stopPropagation(); onMinimize(); }} aria-label="Minimize">
            <svg width="10" height="10" viewBox="0 0 10 10"><line x1="0" y1="5" x2="10" y2="5" stroke="currentColor" strokeWidth="1" /></svg>
          </WinBtn>
          <WinBtn onClick={(e) => { e.stopPropagation(); setMaximized((m) => !m); }} aria-label="Maximize">
            <svg width="10" height="10" viewBox="0 0 10 10"><rect x="0.5" y="0.5" width="9" height="9" fill="none" stroke="currentColor" strokeWidth="1" /></svg>
          </WinBtn>
          <WinBtn close onClick={(e) => { e.stopPropagation(); onClose(); }} aria-label="Close">
            <svg width="10" height="10" viewBox="0 0 10 10"><line x1="0" y1="0" x2="10" y2="10" stroke="currentColor" strokeWidth="1" /><line x1="10" y1="0" x2="0" y2="10" stroke="currentColor" strokeWidth="1" /></svg>
          </WinBtn>
        </div>
      </div>

      {/* Content */}
      <TerminalBody />
    </div>
  );
}

function WinBtn({ children, onClick, close, ...rest }: { children: React.ReactNode; onClick: (e: React.MouseEvent) => void; close?: boolean } & React.HTMLAttributes<HTMLButtonElement>) {
  return (
    <button
      {...rest}
      onClick={onClick}
      className={`flex h-full w-12 items-center justify-center text-white/80 transition ${
        close ? "hover:bg-red-600 hover:text-white" : "hover:bg-white/10"
      }`}
    >
      {children}
    </button>
  );
}

function TerminalBody() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stage, setStage] = useState<Stage>("banner");
  const [input, setInput] = useState("");
  const [webhookName, setWebhookName] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const append = useCallback((line: Line) => setLines((l) => [...l, line]), []);

  // Banner animation
  useEffect(() => {
    let cancelled = false;
    const bannerLines = BANNER.split("\n");
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i < bannerLines.length) {
        setLines((l) => [...l, { text: bannerLines[i], color: "var(--terminal-red)" }]);
        i++;
        setTimeout(tick, 70);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          setLines((l) => [...l, { text: "" }, { text: "Welcome to dexbin v1.0" }, { text: "" }, { text: "Please enter your Discord webhook URL:" }]);
          setStage("askWebhook");
        }, 250);
      }
    };
    tick();
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [lines, stage]);

  useEffect(() => {
    if (stage === "askWebhook" || stage === "confirm") inputRef.current?.focus();
  }, [stage]);

  const submitWebhook = async (url: string) => {
    append({ text: `> ${url.replace(/(\/[^/]+)$/, "/****")}` });
    setStage("validating");
    append({ text: "Validating webhook..." });
    try {
      const trimmed = url.trim();
      if (!/^https:\/\/(canary\.|ptb\.)?discord(app)?\.com\/api\/webhooks\//.test(trimmed)) {
        append({ text: "Error: not a valid Discord webhook URL.", color: "var(--terminal-red)" });
        append({ text: "" });
        append({ text: "Please enter your Discord webhook URL:" });
        setStage("askWebhook");
        return;
      }
      const res = await fetch(trimmed);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: { name?: string; channel_id?: string; guild_id?: string } = await res.json();
      const name = data.name || "Unknown Webhook";
      setWebhookName(name);
      setWebhookUrl(trimmed);
      append({ text: `Webhook found: ${name}`, color: "oklch(0.85 0.18 140)" });
      append({ text: "Is this your webhook? (y/n)" });
      setStage("confirm");
    } catch (e) {
      append({ text: `Error: could not reach webhook (${(e as Error).message}).`, color: "var(--terminal-red)" });
      append({ text: "" });
      append({ text: "Please enter your Discord webhook URL:" });
      setStage("askWebhook");
    }
  };

  const submitConfirm = (val: string) => {
    const v = val.trim().toLowerCase();
    append({ text: `> ${v}` });
    if (v === "y" || v === "yes") {
      append({ text: `Confirmed. Linked to "${webhookName}".`, color: "oklch(0.85 0.18 140)" });
      setStage("done");
    } else if (v === "n" || v === "no") {
      append({ text: "Discarded. Please enter your Discord webhook URL:" });
      setWebhookName("");
      setWebhookUrl("");
      setStage("askWebhook");
    } else {
      append({ text: "Please answer y or n.", color: "var(--terminal-red)" });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const val = input;
    setInput("");
    if (stage === "askWebhook") submitWebhook(val);
    else if (stage === "confirm") submitConfirm(val);
  };

  const prompt = stage === "askWebhook" ? "webhook>" : stage === "confirm" ? "(y/n)>" : "$";
  const showInput = stage === "askWebhook" || stage === "confirm";

  void webhookUrl;

  return (
    <div
      ref={scrollRef}
      onClick={() => inputRef.current?.focus()}
      className="flex-1 overflow-y-auto p-3 font-mono text-[12.5px] leading-[1.35]"
      style={{ background: "var(--terminal-bg)", color: "var(--terminal-fg)", fontFamily: "TerminalMono, ui-monospace, Menlo, Consolas, monospace" }}
    >
      {lines.map((l, i) => (
        <div key={i} style={{ color: l.color || "var(--terminal-fg)", whiteSpace: "pre" }}>
          {l.text || "\u00A0"}
        </div>
      ))}
      {showInput && (
        <form onSubmit={onSubmit} className="flex items-center gap-2">
          <span style={{ color: "oklch(0.78 0.16 200)" }}>{prompt}</span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            className="flex-1 bg-transparent outline-none"
            style={{ color: "var(--terminal-fg)", fontFamily: "inherit", fontSize: "inherit", caretColor: "var(--terminal-cursor)" }}
            autoComplete="off"
            spellCheck={false}
          />
        </form>
      )}
      {stage === "validating" && <span className="terminal-cursor">▮</span>}
      {stage === "done" && (
        <div className="mt-1 flex">
          <span style={{ color: "oklch(0.78 0.16 200)" }}>$</span>
          <span className="ml-2 terminal-cursor">▮</span>
        </div>
      )}
    </div>
  );
}