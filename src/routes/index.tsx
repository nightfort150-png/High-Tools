import { createFileRoute } from "@tanstack/react-router";
import { FullscreenTerminal } from "@/components/desktop/TerminalWindow";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "HIGH — terminal" },
      { name: "description", content: "HIGH terminal interface." },
    ],
  }),
});

function Index() {
  return (
    <main className="h-screen w-screen overflow-hidden bg-black">
      <h1 className="sr-only">HIGH terminal</h1>
      <FullscreenTerminal />
    </main>
  );
}
