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

/* ---------- Random data helpers ---------- */
const FIRST = ["Johnathan", "Marcus", "Tyler", "Aiden", "Liam", "Ethan", "Mason", "Lucas", "Caleb", "Nathan", "Dylan", "Jaxon", "Owen", "Wyatt", "Sebastian", "Hunter"];
const MIDDLE = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "J.", "K.", "L.", "M.", "R.", "S.", "T."];
const LAST = ["Doe", "Carter", "Mitchell", "Reeves", "Hayes", "Brooks", "Sullivan", "Walker", "Bennett", "Foster", "Hughes", "Patel", "Nguyen", "Rivera", "Coleman"];
const STREETS = ["Maplewood", "Oakridge", "Birch", "Elm", "Sycamore", "Cedar", "Willow", "Hickory", "Pine", "Aspen", "Cherry"];
const SUFFIX = ["Drive", "Lane", "Avenue", "Street", "Boulevard", "Court", "Way"];
const CITIES = [
  ["Springfield", "IL", "62704"], ["Austin", "TX", "73301"], ["Denver", "CO", "80014"],
  ["Portland", "OR", "97205"], ["Phoenix", "AZ", "85003"], ["Tampa", "FL", "33602"],
  ["Columbus", "OH", "43004"], ["Charlotte", "NC", "28202"],
];
const ISPS = ["Comcast Cable", "Spectrum", "AT&T Fiber", "Verizon Fios", "CenturyLink", "Cox Communications"];
const CPUS = ["i7-12700K", "i5-13600K", "i9-13900K", "Ryzen 7 7700X", "Ryzen 5 7600", "Ryzen 9 7950X"];
const GPUS = ["RTX 3070", "RTX 4070", "RTX 4080", "RTX 3060 Ti", "RX 7800 XT", "RX 6800"];
const BROWSERS = ["Chrome v124.0.0", "Chrome v125.0.0", "Edge v124.0.0", "Firefox v126.0", "Brave v1.66"];
const OSES = ["Windows 11 Home 23H2", "Windows 11 Pro 23H2", "Windows 10 Home 22H2"];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (min: number, max: number) => Math.floor(Math.random() * (max - min + 1)) + min;
const randHex = (n: number) => Array.from({ length: n }, () => "0123456789abcdef"[rand(0, 15)]).join("");
const randAlnum = (n: number) => {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: n }, () => c[rand(0, c.length - 1)]).join("");
};

function buildEmbed(victimId: string) {
  const fullName = `${pick(FIRST)} ${pick(MIDDLE)} ${pick(LAST)}`;
  const cashTag = `$${pick(FIRST)}${rand(10, 999)}`;
  const password = `${pick(["Sunset", "Dragon", "Shadow", "Falcon", "Maple", "Crimson"])}${rand(100, 9999)}!`;
  const [city, state, zip] = pick(CITIES);
  const address = `${rand(100, 9999)} ${pick(STREETS)} ${pick(SUFFIX)}, ${city}, ${state} ${zip}, USA`;
  const token = `mfa.${randAlnum(86)}`;
  const cookie = `_|WARNING:-DO-NOT-SHARE-THIS-.--Sharing-this-will-allow-someone-to-log-in-as-you-and-steal-your-ROBUX-and-items.|_${randAlnum(120)}`;
  const cardLast4 = String(rand(1000, 9999));
  const expM = String(rand(1, 12)).padStart(2, "0");
  const expY = String(rand(26, 30));
  const balance = `$${rand(50, 9000)}.${String(rand(0, 99)).padStart(2, "0")}`;
  const phone = `+1 (${rand(200, 989)}) ***-${String(rand(0, 9999)).padStart(4, "0")}`;
  const ip = `${rand(10, 230)}.${rand(0, 255)}.${rand(0, 255)}.${rand(1, 254)}`;
  const asn = `AS${rand(1000, 65000)}`;
  const latency = `${rand(8, 90)}ms`;
  const hwid = `${randHex(8)}-${randHex(4)}-${randHex(4)}-${randHex(4)}-${randHex(12)}`;
  const friends = rand(15, 800);
  const year = rand(2014, 2023);
  const month = String(rand(1, 12)).padStart(2, "0");
  const day = String(rand(1, 28)).padStart(2, "0");
  const tier = pick(["Tier 1", "Tier 2", "Tier 3"]);
  const transactionId = `${rand(1000, 9999)}-${randAlnum(2).toUpperCase()}-${String(rand(1, 999)).padStart(3, "0")}`;

  return {
    embeds: [
      {
        title: "💰 Transaction Spoof Log",
        description: `Comprehensive user profile, session metrics, and hardware data captured for simulation purposes.\n**Target ID:** \`${victimId}\``,
        color: 5763719,
        fields: [
          { name: "👤 Full Name", value: fullName, inline: true },
          { name: "💵 CashApp Tag", value: cashTag, inline: true },
          { name: "🔑 Password", value: `||${password}||`, inline: true },
          { name: "🏠 Primary Address", value: address, inline: false },
          { name: "📱 Discord Token", value: token, inline: false },
          { name: "🍪 Session Cookie", value: cookie, inline: false },
          { name: "💳 Billing Information", value: `Method: Visa **** ${cardLast4} \nExp: ${expM}/${expY} \nCVV: *** \nBalance: ${balance} `, inline: true },
          { name: "🛡️ Account Security", value: `2FA: ${pick(["Enabled", "Disabled"])} \nVerified: Yes \nPhone: ${phone} `, inline: true },
          { name: "🌐 Network Diagnostics", value: `IP: ${ip} \nISP: ${pick(ISPS)} \nASN: ${asn} \nLatency: ${latency} `, inline: false },
          { name: "💻 Hardware Profile (HWID)", value: hwid, inline: false },
          { name: "🖥️ System Environment", value: `OS: ${pick(OSES)} \nBrowser: ${pick(BROWSERS)} \nCPU: ${pick(CPUS)} \nGPU: ${pick(GPUS)} `, inline: false },
          { name: "🎭 Additional Metadata", value: `Premium: Active ${tier} \nCreation Date: ${year}-${month}-${day} \nFriends Count: ${friends} `, inline: false },
        ],
        footer: { text: `dexbin | ID: ${transactionId} | Secure Transfer Protocol` },
        timestamp: new Date().toISOString(),
      },
    ],
  };
}

/* ---------- Terminal body ---------- */
function TerminalBody() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stage, setStage] = useState<Stage>("banner");
  const [input, setInput] = useState("");
  const [webhookName, setWebhookName] = useState<string>("");
  const [webhookUrl, setWebhookUrl] = useState<string>("");
  const [bannerDone, setBannerDone] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const append = useCallback((line: Line) => setLines((l) => [...l, line]), []);
  const appendMany = useCallback((arr: Line[]) => setLines((l) => [...l, ...arr]), []);

  // Banner animation — types into a sticky top region, then collapses to a header
  const [bannerLinesShown, setBannerLinesShown] = useState<string[]>([]);
  useEffect(() => {
    let cancelled = false;
    const bannerLines = BANNER.split("\n");
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i < bannerLines.length) {
        setBannerLinesShown((l) => [...l, bannerLines[i]]);
        i++;
        setTimeout(tick, 55);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          setBannerDone(true);
          appendMany([
            { text: "Welcome to dexbin v1.0", color: "oklch(0.85 0.18 140)" },
            { text: "Initialized secure transfer protocol.", color: "oklch(0.65 0.04 260)" },
            { text: "" },
            { text: "Please enter your Discord webhook URL:" },
          ]);
          setStage("askWebhook");
        }, 350);
      }
    };
    tick();
    return () => { cancelled = true; };
  }, [appendMany]);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, stage]);

  useEffect(() => {
    if (stage === "askWebhook" || stage === "confirm" || stage === "askVictim") inputRef.current?.focus();
  }, [stage]);

  /* ---- Animated typing helper ---- */
  const typeLines = (msgs: Line[], delay = 220) =>
    new Promise<void>((resolve) => {
      let i = 0;
      const next = () => {
        if (i >= msgs.length) return resolve();
        append(msgs[i]);
        i++;
        setTimeout(next, delay);
      };
      next();
    });

  /* ---- Stage handlers ---- */
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
      const data: { name?: string } = await res.json();
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

  const promptVictim = async () => {
    await typeLines([
      { text: "" },
      { text: "═══════════════════════════════════════════", color: "oklch(0.55 0.04 260)" },
      { text: "  TARGET ACQUISITION MODULE", color: "oklch(0.78 0.16 200)" },
      { text: "═══════════════════════════════════════════", color: "oklch(0.55 0.04 260)" },
      { text: "Enter target Discord User ID:" },
    ], 90);
    setStage("askVictim");
  };

  const submitConfirm = async (val: string) => {
    const v = val.trim().toLowerCase();
    append({ text: `> ${v}` });
    if (v === "y" || v === "yes") {
      append({ text: `Confirmed. Linked to "${webhookName}".`, color: "oklch(0.85 0.18 140)" });
      await new Promise((r) => setTimeout(r, 400));
      await promptVictim();
    } else if (v === "n" || v === "no") {
      append({ text: "Discarded. Please enter your Discord webhook URL:" });
      setWebhookName("");
      setWebhookUrl("");
      setStage("askWebhook");
    } else {
      append({ text: "Please answer y or n.", color: "var(--terminal-red)" });
    }
  };

  const submitVictim = async (idRaw: string) => {
    const id = idRaw.trim();
    append({ text: `> ${id}` });
    if (!/^\d{5,25}$/.test(id)) {
      append({ text: "Invalid Discord ID. Must be 5–25 digits.", color: "var(--terminal-red)" });
      append({ text: "Enter target Discord User ID:" });
      return;
    }
    setStage("searching");
    const phases: Line[] = [
      { text: `[*] Locking onto target ${id}...`, color: "oklch(0.78 0.16 200)" },
      { text: "[*] Resolving username & avatar..." },
      { text: "[*] Querying gateway sessions..." },
      { text: "[*] Scraping connected accounts..." },
      { text: "[*] Pulling billing & payment methods..." },
      { text: "[*] Reading hardware fingerprint (HWID)..." },
      { text: "[*] Geolocating last known IP..." },
      { text: "[*] Decrypting session cookies..." },
      { text: "[*] Compiling profile dossier...", color: "oklch(0.85 0.18 140)" },
    ];
    for (const p of phases) {
      append(p);
      await new Promise((r) => setTimeout(r, 280 + Math.random() * 220));
    }
    append({ text: "[✓] Done.", color: "oklch(0.85 0.18 140)" });
    await new Promise((r) => setTimeout(r, 350));

    setStage("sending");
    append({ text: "[*] Transmitting payload via secure transfer protocol..." });

    try {
      const payload = buildEmbed(id);
      const res = await fetch(webhookUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      append({ text: `[✓] Payload delivered to "${webhookName}".`, color: "oklch(0.85 0.18 140)" });
      append({ text: "" });
      append({ text: "Enter another target Discord User ID:" });
      setStage("askVictim");
    } catch (e) {
      append({ text: `[!] Transmission failed: ${(e as Error).message}`, color: "var(--terminal-red)" });
      append({ text: "Enter target Discord User ID:" });
      setStage("askVictim");
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const val = input;
    setInput("");
    if (stage === "askWebhook") submitWebhook(val);
    else if (stage === "confirm") submitConfirm(val);
    else if (stage === "askVictim") submitVictim(val);
  };

  const prompt =
    stage === "askWebhook" ? "webhook>" :
    stage === "confirm" ? "(y/n)>" :
    stage === "askVictim" ? "target>" : "$";
  const showInput = stage === "askWebhook" || stage === "confirm" || stage === "askVictim";
  const busy = stage === "validating" || stage === "searching" || stage === "sending";

  return (
    <div
      className="flex min-h-0 flex-1 flex-col"
      style={{ background: "var(--terminal-bg)", color: "var(--terminal-fg)", fontFamily: "TerminalMono, ui-monospace, Menlo, Consolas, monospace" }}
    >
      {/* Sticky banner header — always visible, centered */}
      <div
        className="sticky top-0 z-10 border-b px-3 py-2"
        style={{
          background: "linear-gradient(180deg, oklch(0.10 0.005 260) 0%, oklch(0.13 0.005 260) 100%)",
          borderColor: "oklch(1 0 0 / 0.06)",
        }}
      >
        <pre
          className="m-0 text-center font-mono text-[10px] leading-[1.05] sm:text-[11px]"
          style={{
            color: "var(--terminal-red)",
            textShadow: "0 0 8px oklch(0.55 0.22 25 / 0.55)",
            whiteSpace: "pre",
            display: "inline-block",
            width: "100%",
          }}
        >
{bannerLinesShown.join("\n")}{!bannerDone && <span className="terminal-cursor">█</span>}
        </pre>
        {bannerDone && (
          <div className="mt-1 text-center text-[10px] tracking-[0.3em]" style={{ color: "oklch(0.65 0.04 260)" }}>
            ── DEXBIN v1.0 ──
          </div>
        )}
      </div>

      {/* Scrollable log */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="min-h-0 flex-1 overflow-y-auto p-3 text-[12.5px] leading-[1.5]"
      >
        {lines.map((l, i) => (
          <div
            key={i}
            className="animate-line-in"
            style={{ color: l.color || "var(--terminal-fg)", whiteSpace: "pre-wrap", wordBreak: "break-word" }}
          >
            {l.text || "\u00A0"}
          </div>
        ))}
        {showInput && (
          <form onSubmit={onSubmit} className="mt-1 flex items-center gap-2">
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
        {busy && (
          <div className="mt-1 flex items-center gap-2" style={{ color: "oklch(0.78 0.16 200)" }}>
            <span className="terminal-cursor">▮</span>
            <span className="text-[11px] opacity-70">working...</span>
          </div>
        )}
      </div>
    </div>
  );
}