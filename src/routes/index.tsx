import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { FolderIcon } from "@/components/desktop/FolderIcon";
import { Taskbar } from "@/components/desktop/Taskbar";
import { TerminalWindow } from "@/components/desktop/TerminalWindow";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Desktop — Terminal" },
      { name: "description", content: "A clean, modern Windows-style desktop with a Terminal app." },
    ],
  }),
});

function Index() {
  const [open, setOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);
  const [z, setZ] = useState(10);

  const openTerminal = () => {
    setOpen(true);
    setMinimized(false);
    setZ((v) => v + 1);
  };

  const handleTaskbarClick = () => {
    if (minimized) {
      setMinimized(false);
      setZ((v) => v + 1);
    } else {
      setMinimized(true);
    }
  };

  return (
    <main
      className="relative h-screen w-screen overflow-hidden"
      style={{ background: "var(--desktop-gradient)" }}
    >
      <h1 className="sr-only">Desktop</h1>

      {/* Subtle wallpaper glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          background:
            "radial-gradient(60% 60% at 30% 30%, oklch(0.7 0.15 240 / 0.25), transparent 60%), radial-gradient(50% 50% at 80% 80%, oklch(0.6 0.18 300 / 0.25), transparent 60%)",
        }}
      />

      {/* Desktop icons */}
      <div className="absolute left-4 top-4 grid grid-cols-1 gap-2">
        <FolderIcon label="Terminal" onOpen={openTerminal} />
      </div>

      {/* Windows */}
      <TerminalWindow
        open={open}
        minimized={minimized}
        zIndex={z}
        onClose={() => setOpen(false)}
        onMinimize={() => setMinimized(true)}
        onFocus={() => setZ((v) => v + 1)}
      />

      {/* Taskbar */}
      <Taskbar
        terminalOpen={open}
        terminalMinimized={minimized}
        onTerminalClick={handleTaskbarClick}
      />
    </main>
  );
}
