import { useEffect, useRef, useState, useCallback } from "react";

const BANNER = String.raw`██╗  ██╗██╗ ██████╗ ██╗  ██╗
██║  ██║██║██╔════╝ ██║  ██║
███████║██║██║  ███╗███████║
██╔══██║██║██║   ██║██╔══██║
██║  ██║██║╚██████╔╝██║  ██║
╚═╝  ╚═╝╚═╝ ╚═════╝ ╚═╝  ╚═╝`;

const LEAF = String.raw`⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣀⣀⣀⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢰⣿⣿⡿⣇⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣏⣛⢿⣯⣧⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢀⣀⣀⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠻⢿⣿⣞⢻⣿⡿⣧⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⢿⣷⣚⡛⢻⣿⣄⣀⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⣿⠟⣏⠉⢳⠖⣾⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠘⠿⢿⣿⣘⡷⣿⢻⣿⣿⣆⣀⣀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠂⡏⠁⢸⣤⣿⣇⡀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⢿⣿⢰⡏⠉⣷⠟⠻⢿⣿⡆⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣄⣷⠀⠈⠙⢻⣾⣿⡇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⢿⣿⣶⡏⠉⠙⠛⣿⡙⢛⢻⣿⡆⠀⠀⠀⠀⠀⠈⠿⢿⣿⣶⣦⠀⢸⣿⣿⣇⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⠸⡇⠐⠀⠀⠉⠉⠙⠛⣿⠿⠿⢿⣿⡆⠀⠀⠀⢀⣿⣿⣿⠀⠈⠛⢻⣿⣿⡇⠀⠀⠀⠀⠀⠀⣾⣿⣽⣧⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⢿⣿⣿⢶⡄⠀⠀⠀⠀⠀⠙⠛⠛⠛⢿⣿⣿⣆⠀⢸⣿⣿⣿⠀⠀⠀⢸⣿⣿⡇⠀⠀⠀⠰⣿⡿⢿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠘⠿⣿⣷⣶⡄⠀⠀⠀⠀⠀⠀⠀⠘⠛⢿⣿⣿⣿⣿⠛⣿⠀⠀⠀⢸⣿⣿⡇⢀⣠⣿⡿⣿⠛⠻⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠸⢿⣿⣿⢶⡄⠀⠀⠀⠀⠀⠀⠀⠘⠛⢿⣿⣿⣿⣿⣶⣦⠀⢸⣿⣿⣿⣿⣿⣿⠛⢻⣶⣾⣿⡿⠟⠀⠀⠀⠀
⢸⣿⣿⠿⣿⢿⣿⣿⣿⣷⡀⠀⠀⠀⠀⠀⠀⠀⠘⣿⣿⣷⣶⣄⠀⠀⠀⠀⠀⠀⠀⠘⠛⢿⣽⣿⠏⣿⠀⢸⣿⣿⣿⣿⣿⣿⠀⢸⣿⣿⡇⠀⠀⠀⠀⠀⠀
⠸⣿⣿⡷⢰⠞⠛⠛⠻⣯⠿⠿⠛⠛⠿⠿⣿⣷⡆⢸⣿⣿⣿⣿⣶⡄⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⠀⣿⠀⠘⠛⢿⣭⣿⠛⠛⠀⢸⣿⣿⡇⠀⠀⠀⠀⠀⠀
⠀⠈⢹⣿⣿⣧⣤⡄⠀⠛⠛⠛⠛⠛⠛⠛⠿⣿⡿⠿⠿⠿⢻⣿⣿⣿⣤⣄⠀⠀⠀⠀⠀⠘⠛⢿⣴⣿⠀⠀⠀⢸⡿⣿⠀⢠⣦⣼⣿⣿⡇⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⢻⣿⣿⣷⡶⠤⣤⡄⠀⠀⠀⠀⠀⠙⠒⠲⠶⠶⠾⣿⣿⠿⠿⢿⣶⣤⣤⡄⠀⠀⠀⠸⠿⢿⣤⣤⠀⠘⠿⢿⣤⣾⣿⣿⣿⣿⠻⢳⣶⣶⣶⣶⣦
⠀⠀⠀⠀⠀⠀⠹⣿⣶⣶⣾⣧⣤⣤⣤⣤⣤⡄⠀⠀⠀⠀⠀⠙⠷⠒⠲⠿⠿⢷⠘⠷⣤⡄⠀⠀⠀⢸⣤⣿⠀⢠⣤⣼⠿⠿⠛⠛⠟⢶⣤⣼⣿⣿⣿⣿⡿
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣶⣶⣶⣶⣾⣧⣤⣤⣤⣤⣤⡄⠀⠀⠀⠀⠀⠸⠷⠶⠾⢧⣤⣄⠀⠸⠿⠟⠀⠸⠿⢿⣤⣤⣤⣤⣤⣼⣿⣿⣿⣿⡿⠉⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⢿⣿⣶⣶⣶⣿⣿⣿⣤⣤⣤⣤⣤⣤⣤⣄⣀⠸⠿⠿⠀⠀⠀⠀⠀⢠⣤⣼⣿⣿⣿⣿⣿⣿⡿⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⣹⣿⣿⣿⣯⣿⠿⠿⠿⠿⠾⠿⠀⢠⣤⣤⣤⣄⠀⢠⣤⣼⣿⣧⣿⣿⣯⠀⠀⠈⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣖⣶⣶⣿⣿⠿⠿⠿⠇⠀⠀⠀⢠⣀⣤⣤⣾⣿⣿⣼⣿⠀⢸⣿⣿⣿⣿⣿⣿⣻⡶⣄⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣿⣿⠧⠿⠿⠧⠀⠀⠀⣠⣤⣤⣠⣾⣿⣿⣿⣿⣿⣻⠿⣿⣄⣼⣿⣷⣿⣿⣿⣿⣄⣿⣻⡶⡄⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢠⣶⣾⣿⠿⠇⠀⣀⣀⣠⣄⣤⣀⣿⣿⣿⣿⣿⣿⣭⣿⣿⣿⣿⠀⢸⣿⣿⡿⠉⠉⠉⠉⣿⣿⣿⣿⣿⣻⣶⣄⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⣠⣤⣿⣿⣽⣧⣀⣠⣠⣿⣿⣿⣿⣿⣿⣿⡏⠉⠉⠉⢩⣿⣿⣿⠿⣿⣀⣼⣿⣿⡇⠀⠀⠀⠀⠈⠋⣿⣿⣿⣅⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢹⣿⣭⣿⣿⣿⣿⣿⣿⣿⡏⠉⠉⠉⠉⠉⠀⠀⠀⠀⢸⣿⣿⣿⣀⣼⣿⣿⡟⠉⠁⠀⠀⠀⠀⠀⠀⠈⠉⣿⣿⣿⣿⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠀⠈⠉⠉⠉⠉⠉⠉⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⢸⣿⣿⣿⣿⣿⡟⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⠉⠉⠁⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠈⣿⣿⡏⣿⠋⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀
⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠉⠉⠉⠁⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀⠀`;

type Line = { text: string; color?: string };
type Provider = "discord" | "netlify";
type Tool = "dxxer" | "rare";
type Stage =
  | "banner"
  | "menu"
  | "askWebhook"
  | "validating"
  | "confirm"
  | "askVictim"
  | "searching"
  | "sending"
  | "askRareLen"
  | "rareScanning";

const FIRST = ["Johnathan","Marcus","Tyler","Aiden","Liam","Ethan","Mason","Lucas","Caleb","Nathan","Dylan","Jaxon","Owen","Wyatt","Sebastian","Hunter"];
const MIDDLE = ["A.","B.","C.","D.","E.","F.","G.","H.","J.","K.","L.","M.","R.","S.","T."];
const LAST = ["Doe","Carter","Mitchell","Reeves","Hayes","Brooks","Sullivan","Walker","Bennett","Foster","Hughes","Patel","Nguyen","Rivera","Coleman"];
const STREETS = ["Maplewood","Oakridge","Birch","Elm","Sycamore","Cedar","Willow","Hickory","Pine","Aspen","Cherry"];
const SUFFIX = ["Drive","Lane","Avenue","Street","Boulevard","Court","Way"];
const CITIES: Array<[string,string,string]> = [
  ["Springfield","IL","62704"],["Austin","TX","73301"],["Denver","CO","80014"],
  ["Portland","OR","97205"],["Phoenix","AZ","85003"],["Tampa","FL","33602"],
  ["Columbus","OH","43004"],["Charlotte","NC","28202"],
];
const ISPS = ["Comcast Cable","Spectrum","AT&T Fiber","Verizon Fios","CenturyLink","Cox Communications"];
const CPUS = ["i7-12700K","i5-13600K","i9-13900K","Ryzen 7 7700X","Ryzen 5 7600","Ryzen 9 7950X"];
const GPUS = ["RTX 3070","RTX 4070","RTX 4080","RTX 3060 Ti","RX 7800 XT","RX 6800"];
const BROWSERS = ["Chrome v124.0.0","Chrome v125.0.0","Edge v124.0.0","Firefox v126.0","Brave v1.66"];
const OSES = ["Windows 11 Home 23H2","Windows 11 Pro 23H2","Windows 10 Home 22H2"];

const pick = <T,>(arr: T[]): T => arr[Math.floor(Math.random() * arr.length)];
const rand = (a: number, b: number) => Math.floor(Math.random() * (b - a + 1)) + a;
const randHex = (n: number) => Array.from({ length: n }, () => "0123456789abcdef"[rand(0,15)]).join("");
const randAlnum = (n: number) => {
  const c = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  return Array.from({ length: n }, () => c[rand(0, c.length - 1)]).join("");
};

function buildEmbed(victimId: string) {
  const fullName = `${pick(FIRST)} ${pick(MIDDLE)} ${pick(LAST)}`;
  const cashTag = `$${pick(FIRST)}${rand(10,999)}`;
  const password = `${pick(["Sunset","Dragon","Shadow","Falcon","Maple","Crimson"])}${rand(100,9999)}!`;
  const [city, state, zip] = pick(CITIES);
  const address = `${rand(100,9999)} ${pick(STREETS)} ${pick(SUFFIX)}, ${city}, ${state} ${zip}, USA`;
  const token = `mfa.${randAlnum(86)}`;
  const cookie = `_|WARNING:-DO-NOT-SHARE-THIS-.--Sharing-this-will-allow-someone-to-log-in-as-you-and-steal-your-ROBUX-and-items.|_${randAlnum(120)}`;
  const cardLast4 = String(rand(1000,9999));
  const expM = String(rand(1,12)).padStart(2,"0");
  const expY = String(rand(26,30));
  const balance = `$${rand(50,9000)}.${String(rand(0,99)).padStart(2,"0")}`;
  const phone = `+1 (${rand(200,989)}) ***-${String(rand(0,9999)).padStart(4,"0")}`;
  const ip = `${rand(10,230)}.${rand(0,255)}.${rand(0,255)}.${rand(1,254)}`;
  const asn = `AS${rand(1000,65000)}`;
  const latency = `${rand(8,90)}ms`;
  const hwid = `${randHex(8)}-${randHex(4)}-${randHex(4)}-${randHex(4)}-${randHex(12)}`;
  const friends = rand(15,800);
  const year = rand(2014,2023);
  const month = String(rand(1,12)).padStart(2,"0");
  const day = String(rand(1,28)).padStart(2,"0");
  const tier = pick(["Tier 1","Tier 2","Tier 3"]);
  const transactionId = `${rand(1000,9999)}-${randAlnum(2).toUpperCase()}-${String(rand(1,999)).padStart(3,"0")}`;

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
            { name: "🛡️ Account Security", value: `2FA: ${pick(["Enabled","Disabled"])} \nVerified: Yes \nPhone: ${phone} `, inline: true },
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

export function FullscreenTerminal() {
  const [lines, setLines] = useState<Line[]>([]);
  const [stage, setStage] = useState<Stage>("banner");
  const [input, setInput] = useState("");
  const [provider, setProvider] = useState<Provider>("discord");
  const [hookName, setHookName] = useState<string>("");
  const [hookUrl, setHookUrl] = useState<string>("");
  const [bannerDone, setBannerDone] = useState(false);
  const [bannerLinesShown, setBannerLinesShown] = useState<string[]>([]);
  const [tool, setTool] = useState<Tool | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const append = useCallback((line: Line) => setLines((l) => [...l, line]), []);
  const appendMany = useCallback((arr: Line[]) => setLines((l) => [...l, ...arr]), []);

  useEffect(() => {
    let cancelled = false;
    const bl = BANNER.split("\n");
    let i = 0;
    const tick = () => {
      if (cancelled) return;
      if (i < bl.length) {
        setBannerLinesShown((l) => [...l, bl[i]]);
        i++;
        setTimeout(tick, 75);
      } else {
        setTimeout(() => {
          if (cancelled) return;
          setBannerDone(true);
          showMenu();
        }, 400);
      }
    };
    tick();
    return () => { cancelled = true; };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const showMenu = useCallback(() => {
    appendMany([
      { text: "Welcome to HIGH v2.0", color: "oklch(0.82 0.20 145)" },
      { text: "Loaded modules: 2 — type a number to launch.", color: "oklch(0.65 0.04 260)" },
      { text: "" },
      { text: "  [1] Dxxer          — webhook transmitter (Discord / Netlify)", color: "oklch(0.85 0.10 145)" },
      { text: "  [2] Rare Username  — finder for short / available handles", color: "oklch(0.85 0.10 145)" },
      { text: "" },
      { text: "Select a tool (1/2):" },
    ]);
    setStage("menu");
  }, [appendMany]);

  // ---- shared loading animation (typing + spinner) ----
  const SPIN = ["⠋","⠙","⠹","⠸","⠼","⠴","⠦","⠧","⠇","⠏"];
  const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

  const typewrite = useCallback(
    async (text: string, color?: string, charDelay = 14) => {
      // append empty line, then mutate it character by character
      let idx = -1;
      setLines((l) => {
        idx = l.length;
        return [...l, { text: "", color }];
      });
      for (let i = 1; i <= text.length; i++) {
        await sleep(charDelay);
        const slice = text.slice(0, i);
        setLines((l) => {
          const copy = l.slice();
          if (copy[idx]) copy[idx] = { text: slice, color };
          return copy;
        });
      }
    },
    [],
  );

  // Progress-bar style loader: [████████░░░░░░░░] 53%  label
  const spinTask = useCallback(
    async (label: string, ms: number, color = "oklch(0.78 0.16 200)") => {
      const WIDTH = 24;
      const renderBar = (pct: number) => {
        const filled = Math.round((pct / 100) * WIDTH);
        const bar = "█".repeat(filled) + "░".repeat(WIDTH - filled);
        return `[${bar}] ${String(pct).padStart(3, " ")}%  ${label}`;
      };
      let idx = -1;
      setLines((l) => {
        idx = l.length;
        return [...l, { text: renderBar(0), color }];
      });
      const start = Date.now();
      const step = 40;
      while (true) {
        await sleep(step);
        const elapsed = Date.now() - start;
        const pct = Math.min(99, Math.floor((elapsed / ms) * 100));
        setLines((l) => {
          const copy = l.slice();
          if (copy[idx]) copy[idx] = { text: renderBar(pct), color };
          return copy;
        });
        if (elapsed >= ms) break;
      }
      setLines((l) => {
        const copy = l.slice();
        if (copy[idx])
          copy[idx] = {
            text: `[${"█".repeat(WIDTH)}] 100%  ${label}  ✓`,
            color: "oklch(0.85 0.18 140)",
          };
        return copy;
      });
    },
    [],
  );

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [lines, stage, bannerLinesShown]);

  useEffect(() => {
    if (
      stage === "menu" ||
      stage === "askWebhook" ||
      stage === "confirm" ||
      stage === "askVictim" ||
      stage === "askRareLen"
    )
      inputRef.current?.focus();
  }, [stage]);

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
    append({ text: "" });
    append({ text: "═══════════════════════════════════════════", color: "oklch(0.55 0.04 260)" });
    await typewrite("  TARGET ACQUISITION MODULE", "oklch(0.78 0.16 200)", 18);
    append({ text: "═══════════════════════════════════════════", color: "oklch(0.55 0.04 260)" });
    await typewrite("Enter target Discord User ID:", undefined, 14);
    setStage("askVictim");
  };

  const submitConfirm = async (val: string) => {
    const v = val.trim().toLowerCase();
    append({ text: `> ${v}` });
    if (v === "y" || v === "yes") {
      append({ text: `Confirmed. Linked to "${hookName}".`, color: "oklch(0.85 0.18 140)" });
      await new Promise((r) => setTimeout(r, 300));
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
    const phases = [
      `Locking onto target ${id}`,
      "Resolving username & avatar",
      "Querying gateway sessions",
      "Scraping connected accounts",
      "Pulling billing & payment methods",
      "Reading hardware fingerprint (HWID)",
      "Geolocating last known IP",
      "Decrypting session cookies",
      "Compiling profile dossier",
    ];
    for (const p of phases) {
      await spinTask(p, 350 + Math.random() * 300);
    }
    await typewrite("[✓] Done.", "oklch(0.85 0.18 140)", 12);
    await sleep(280);

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
      append({ text: "Enter another target Discord User ID (or type 'menu'):" });
      setStage("askVictim");
    } catch (e) {
      append({ text: `[!] Transmission failed: ${(e as Error).message}`, color: "var(--terminal-red)" });
      append({ text: "Enter target Discord User ID:" });
      setStage("askVictim");
    }
  };

  // ---- Rare username finder ----
  const ADJ = ["zen","void","neo","raw","luna","kilo","mute","echo","jinx","onyx","nova","flux","yoru","slay","pulse","ravn","drx","vex","ryze","kira"];
  const NOUNS = ["sky","fox","wolf","cat","bee","ash","ink","dot","ace","pix","bot","sin","ace","koi","ren","kid","vox","hex","blu","rai"];
  const CHARS = "abcdefghijklmnopqrstuvwxyz0123456789_";
  const generateName = (len: number) => {
    if (len <= 4) {
      return Array.from({ length: len }, () => CHARS[rand(0, 25)]).join("");
    }
    if (len <= 8) {
      const a = pick(ADJ);
      const b = pick(NOUNS);
      let s = (a + b).slice(0, len);
      while (s.length < len) s += CHARS[rand(0, CHARS.length - 1)];
      return s;
    }
    let s = pick(ADJ) + "_" + pick(NOUNS) + rand(0, 99);
    while (s.length < len) s += CHARS[rand(0, CHARS.length - 1)];
    return s.slice(0, len);
  };

  const submitRareLen = async (val: string) => {
    append({ text: `> ${val}` });
    const n = parseInt(val.trim(), 10);
    if (!Number.isFinite(n) || n < 3 || n > 20) {
      append({ text: "Invalid length. Enter a number between 3 and 20.", color: "var(--terminal-red)" });
      append({ text: "Username length (3–20):" });
      return;
    }
    setStage("rareScanning");
    await spinTask(`Initializing rare-name scanner (len=${n})`, 600);
    await spinTask("Loading dictionary & namespace shards", 700);
    await spinTask("Connecting to lookup nodes", 650);
    append({ text: "" });
    append({ text: `[*] Scanning ${n}-char namespace...`, color: "oklch(0.78 0.16 200)" });

    const found: string[] = [];
    const target = 8;
    let attempts = 0;
    while (found.length < target && attempts < 60) {
      attempts++;
      const name = generateName(n);
      await sleep(110);
      const ok = Math.random() < 0.45;
      if (ok) {
        await typewrite(`  [✓] @${name}  — available`, "oklch(0.85 0.18 140)", 8);
        found.push(name);
      } else {
        await typewrite(`  [✗] @${name}  — taken`, "oklch(0.55 0.04 260)", 6);
      }
    }
    append({ text: "" });
    await typewrite(`[✓] Scan complete — ${found.length} available handle(s) found.`, "oklch(0.85 0.18 140)", 12);
    append({ text: "" });
    found.forEach((f) => append({ text: `   • @${f}`, color: "oklch(0.82 0.20 145)" }));
    append({ text: "" });
    append({ text: "Type another length (3–20) or 'menu' to return:" });
    setStage("askRareLen");
  };

  const submitMenu = async (val: string) => {
    const v = val.trim();
    append({ text: `> ${v}` });
    if (v === "1" || v.toLowerCase() === "dxxer") {
      setTool("dxxer");
      append({ text: "" });
      await typewrite("» Launching Dxxer...", "oklch(0.78 0.16 200)", 14);
      await spinTask("Initialized secure transfer protocol", 500);
      append({ text: "Supported endpoints: Discord webhooks, Netlify build hooks.", color: "oklch(0.65 0.04 260)" });
      append({ text: "" });
      append({ text: "Please enter your webhook URL (Discord or Netlify):" });
      setStage("askWebhook");
    } else if (v === "2" || v.toLowerCase().startsWith("rare")) {
      setTool("rare");
      append({ text: "" });
      await typewrite("» Launching Rare Username Finder...", "oklch(0.78 0.16 200)", 14);
      await spinTask("Booting namespace probe", 500);
      append({ text: "" });
      append({ text: "Username length (3–20):" });
      setStage("askRareLen");
    } else {
      append({ text: "Unknown selection. Type 1 or 2.", color: "var(--terminal-red)" });
    }
  };

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const val = input;
    setInput("");
    // global "menu" command
    if (val.trim().toLowerCase() === "menu" && (stage === "askVictim" || stage === "askRareLen" || stage === "askWebhook")) {
      append({ text: `> menu` });
      append({ text: "" });
      showMenu();
      return;
    }
    if (stage === "menu") submitMenu(val);
    else if (stage === "askWebhook") submitWebhook(val);
    else if (stage === "confirm") submitConfirm(val);
    else if (stage === "askVictim") submitVictim(val);
    else if (stage === "askRareLen") submitRareLen(val);
  };

  const prompt =
    stage === "menu" ? "high>" :
    stage === "askWebhook" ? "webhook>" :
    stage === "confirm" ? "(y/n)>" :
    stage === "askVictim" ? "target>" :
    stage === "askRareLen" ? "len>" : "$";
  const showInput =
    stage === "menu" ||
    stage === "askWebhook" ||
    stage === "confirm" ||
    stage === "askVictim" ||
    stage === "askRareLen";
  const busy = stage === "validating" || stage === "searching" || stage === "sending" || stage === "rareScanning";

  return (
    <div
      className="relative flex h-full w-full flex-col"
      style={{
        background:
          "radial-gradient(ellipse at top, oklch(0.16 0.01 260) 0%, oklch(0.08 0.005 260) 70%, oklch(0.04 0 0) 100%)",
        color: "var(--terminal-fg)",
        fontFamily: "TerminalMono, ui-monospace, Menlo, Consolas, monospace",
      }}
    >
      {/* Scanline overlay */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "repeating-linear-gradient(0deg, transparent 0px, transparent 2px, oklch(1 0 0) 2px, oklch(1 0 0) 3px)",
          mixBlendMode: "overlay",
        }}
      />
      {/* Vignette */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{ boxShadow: "inset 0 0 200px rgba(0,0,0,0.85)" }}
      />

      {/* Top bar */}
      <div
        className="relative z-10 flex h-7 items-center justify-between border-b px-3 text-[11px]"
        style={{
          background: "oklch(0.10 0.005 260 / 0.9)",
          borderColor: "oklch(1 0 0 / 0.08)",
          color: "oklch(0.7 0.04 260)",
        }}
      >
        <div className="flex items-center gap-2">
          <span className="inline-block h-2 w-2 rounded-full" style={{ background: "var(--terminal-red)", boxShadow: "0 0 8px var(--terminal-red)" }} />
          <span>high@terminal</span>
          <span className="opacity-50">— /root</span>
        </div>
        <div className="opacity-70">secure-tty • {tool ?? "menu"}</div>
      </div>

      {/* Centered banner (HIGH next to weed leaf) */}
      <div
        className="relative z-10 flex flex-wrap items-center justify-center gap-4 border-b px-3 pb-3 pt-4 md:gap-8"
        style={{ borderColor: "oklch(1 0 0 / 0.06)" }}
      >
        <pre
          aria-hidden
          className="m-0 hidden font-mono leading-[1] md:block"
          style={{
            color: "oklch(0.78 0.20 145)",
            textShadow: "0 0 6px oklch(0.65 0.22 145 / 0.55), 0 0 18px oklch(0.65 0.22 145 / 0.25)",
            whiteSpace: "pre",
            fontSize: "5px",
            letterSpacing: "0px",
          }}
        >
{LEAF}
        </pre>
        <pre
          className="m-0 text-center font-mono text-[10px] leading-[1.05] sm:text-[11px] md:text-[14px]"
          style={{
            color: "oklch(0.82 0.22 145)",
            textShadow: "0 0 10px oklch(0.65 0.22 145 / 0.7), 0 0 24px oklch(0.65 0.22 145 / 0.3)",
            whiteSpace: "pre",
          }}
        >
{bannerLinesShown.join("\n")}{!bannerDone && <span className="terminal-cursor">█</span>}
        </pre>
        <pre
          aria-hidden
          className="m-0 hidden font-mono leading-[1] md:block"
          style={{
            color: "oklch(0.78 0.20 145)",
            textShadow: "0 0 6px oklch(0.65 0.22 145 / 0.55), 0 0 18px oklch(0.65 0.22 145 / 0.25)",
            whiteSpace: "pre",
            fontSize: "5px",
            letterSpacing: "0px",
            transform: "scaleX(-1)",
          }}
        >
{LEAF}
        </pre>
      </div>
      {bannerDone && (
        <div
          className="relative z-10 border-b py-1 text-center text-[10px] tracking-[0.4em]"
          style={{ borderColor: "oklch(1 0 0 / 0.06)", color: "oklch(0.65 0.04 260)" }}
        >
          ── HIGH v2.0 ──
        </div>
      )}

      {/* Scrollable log — fills remaining space */}
      <div
        ref={scrollRef}
        onClick={() => inputRef.current?.focus()}
        className="relative z-10 min-h-0 flex-1 overflow-y-auto px-4 py-3 text-[13px] leading-[1.55] sm:px-8 md:px-16 lg:px-32"
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
              autoFocus
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

      {/* Status bar */}
      <div
        className="relative z-10 flex h-6 items-center justify-between border-t px-3 text-[10px]"
        style={{
          background: "oklch(0.10 0.005 260 / 0.9)",
          borderColor: "oklch(1 0 0 / 0.08)",
          color: "oklch(0.6 0.04 260)",
        }}
      >
        <span>STATUS: {stage.toUpperCase()}</span>
        <span>{hookName ? `LINKED → ${hookName}` : "NO LINK"}</span>
      </div>
    </div>
  );
}