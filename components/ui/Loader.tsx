"use client";

import { useState, useEffect } from "react";

const MESSAGES = [
  "Recherche de recettes de saison...",
  "Sélection des ingrédients...",
  "Équilibrage des repas...",
  "Finalisation du batch...",
];

export function Loader({ text }: { text?: string }) {
  const [elapsed, setElapsed] = useState(0);
  const [msgIndex, setMsgIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setElapsed((e) => e + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const timer = setInterval(
      () => setMsgIndex((i) => (i + 1) % MESSAGES.length),
      3000
    );
    return () => clearInterval(timer);
  }, []);

  const displayText = text || MESSAGES[msgIndex];

  return (
    <div className="flex flex-col items-center justify-center gap-4 py-16">
      <div className="size-10 animate-spin rounded-full border-4 border-primary-100 border-t-accent-orange" />
      <p className="text-sm text-primary-500 opacity-70 animate-pulse font-sans">{displayText}</p>
      <p className="text-xs text-neutral-400">{elapsed}s</p>
    </div>
  );
}
