import { useEffect, useRef, useState, useCallback } from "react";

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
type Provider = "discord" | "netlify";
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

/* ---------- Random data helpers ---------- */
const FIRST = ["Johnathan", "Marcus", "Tyler", "Aiden", "Liam", "Ethan", "Mason", "Lucas", "Caleb", "Nathan", "Dylan", "Jaxon", "Owen", "Wyatt", "Sebastian", "Hunter"];
const MIDDLE = ["A.", "B.", "C.", "D.", "E.", "F.", "G.", "H.", "J.", "K.", "L.", "M.", "R.", "S.", "T."];
const LAST = ["Doe", "Carter", "Mitchell", "Reeves", "Hayes", "Brooks", "Sullivan", "Walker", "Bennett", "Foster", "Hughes", "Patel", "Nguyen", "Rivera", "Coleman"];
const STREETS = ["Maplewood", "Oakridge", "Birch", "Elm", "Sycamore", "Cedar", "Willow", "Hickory", "Pine", "Aspen", "Cherry"];
const SUFFIX = ["Drive", "Lane", "Avenue", "Street", "Boulevard", "Court", "Way"];
const CITIES: Array<[string, string, string]> = [
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
    fullName,
    transactionId,
    payload: {
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
    },
  };
}

/* ---------- Fullscreen terminal ---------- */
export function FullscreenTerminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stage, setStage] = useState<Stage>("banner");
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<Provider>("discord");
  const [hookName, setHookName] = useState<string>("");
  const [hookUrl, setHookUrl] = useState<string>("");
  const [bannerDone, setBannerDone] = useState(false);
  const [bannerLinesShown, setBannerLinesShown] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const append = useCallback((line: Line) => setLines((l) => [...l, line]), []);
  const appendMany = useCallback((arr: Line[]) => setLines((l) => [...l, ...arr]), []);

  // Banner typing
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
            { text: "Supported endpoints: Discord webhooks, Netlify build hooks.", color: "oklch(0.65 0.04 260)" },
            { text: "" },
            { text: "Please enter your webhook URL (Discord or Netlify):" },
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
  }, [lines, stage, bannerLinesShown]);

  useEffect(() => {
    if (stage === "askWebhook" || stage === "confirm" || stage === "askVictim") inputRef.current?.focus();
  }, [stage]);

  const typeLines = (msgs: Line[], delay = 120) =>
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

  const detectProvider = (url: string): Provider | null => {
    if (/^https:\/\/(canary\.|ptb\.)?discord(app)?\.com\/api\/webhooks\//.test(url)) return "discord";
    if (/^https:\/\/api\.netlify\.com\/build_hooks\/[a-zA-Z0-9]+/.test(url)) return "netlify";
    return null;
  };

  const submitWebhook = async (url: string) => {
    const trimmed = url.trim();
    append({ text: `> ${trimmed.replace(/(\/[^/]+)$/, "/****")}` });
    setStage("validating");
    const kind = detectProvider(trimmed);
    if (!kind) {
      append({ text: "Error: not a valid Discord webhook or Netlify build hook URL.", color: "var(--terminal-red)" });
      append({ text: "" });
      append({ text: "Please enter your webhook URL (Discord or Netlify):" });
      setStage("askWebhook");
      return;
    }
    append({ text: `Detected provider: ${kind === "discord" ? "Discord" : "Netlify"}`, color: "oklch(0.78 0.16 200)" });
    append({ text: "Validating webhook..." });

    try {
      if (kind === "discord") {
        const res = await fetch(trimmed);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: { name?: string } = await res.json();
        const name = data.name || "Unknown Webhook";
        setProvider("discord");
        setHookName(name);
        setHookUrl(trimmed);
        append({ text: `Webhook found: ${name}`, color: "oklch(0.85 0.18 140)" });
      } else {
        // Netlify build hooks have no GET metadata — extract hook id
        const id = trimmed.split("/build_hooks/")[1].split(/[/?]/)[0];
        const name = `Netlify Build Hook (${id.slice(0, 8)}…)`;
        setProvider("netlify");
        setHookName(name);
        setHookUrl(trimmed);
        append({ text: `Webhook found: ${name}`, color: "oklch(0.85 0.18 140)" });
      }
      append({ text: "Is this your webhook? (y/n)" });
      setStage("confirm");
    } catch (e) {
      append({ text: `Error: could not reach webhook (${(e as Error).message}).`, color: "var(--terminal-red)" });
      append({ text: "" });
      append({ text: "Please enter your webhook URL (Discord or Netlify):" });
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
    ], 80);
    setStage("askVictim");
  };

  const submitConfirm = async (val: string) => {
    const v = val.trim().toLowerCase();
    append({ text: `> ${v}` });
    if (v === "y" || v === "yes") {
      append({ text: `Confirmed. Linked to "${hookName}".`, color: "oklch(0.85 0.18 140)" });
      await new Promise((r) => setTimeout(r, 350));
      await promptVictim();
    } else if (v === "n" || v === "no") {
      append({ text: "Discarded. Please enter your webhook URL (Discord or Netlify):" });
      setHookName("");
      setHookUrl("");
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
      await new Promise((r) => setTimeout(r, 240 + Math.random() * 200));
    }
    append({ text: "[✓] Done.", color: "oklch(0.85 0.18 140)" });
    await new Promise((r) => setTimeout(r, 300));

    setStage("sending");
    append({ text: "[*] Transmitting payload via secure transfer protocol..." });

    try {
      const built = buildEmbed(id);
      let res: Response;
      if (provider === "discord") {
        res = await fetch(hookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(built.payload),
        });
      } else {
        // Netlify build hook: trigger a build, optionally with metadata in body
        res = await fetch(hookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            trigger_title: `dexbin: ${built.fullName} (${built.transactionId})`,
            target: id,
          }),
        });
      }
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      append({ text: `[✓] Payload delivered to "${hookName}".`, color: "oklch(0.85 0.18 140)" });
      if (provider === "netlify") {
        append({ text: "[i] Netlify build triggered.", color: "oklch(0.78 0.16 200)" });
      }
      append({ text: "" });
      append({ text: "Enter another target Discord User ID:" });
      setStage("askVictim");
    } catch (e) {
      append({ text: `[!] Transm
