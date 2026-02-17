"use client";

import { useState, useEffect } from "react";
import { getRandomFunContent, type FunContent, type FunContentType } from "@/lib/funContent";

const CONFIG: Record<FunContentType, { label: string; bg: string; icon: string }> = {
  joke:      { label: "BLAGUE DU CHEF",    bg: "bg-accent-yellow text-primary-700", icon: "😄" },
  quote:     { label: "MOT DE CHEF",       bg: "bg-primary-500 text-cream",         icon: "💬" },
  fact:      { label: "LE SAVIEZ-VOUS ?",  bg: "bg-primary-400 text-cream",         icon: "🧐" },
  challenge: { label: "DÉFI DU JOUR",      bg: "bg-accent-orange text-white",       icon: "🔥" },
};

export default function DailyFun() {
  const [content, setContent] = useState<FunContent | null>(null);

  useEffect(() => {
    setContent(getRandomFunContent());
  }, []);

  if (!content) return null;

  const { label, bg, icon } = CONFIG[content.type];

  return (
    <div className={`${bg} p-6 rounded-3xl relative overflow-hidden`}>
      <div className="flex items-center justify-between mb-2 relative z-10">
        <h3 className="text-xl">
          <span className="mr-2">{icon}</span>
          {label}
        </h3>
        <button
          onClick={() => setContent(getRandomFunContent(content))}
          className="text-xs opacity-70 hover:opacity-100 transition bg-white/15 px-3 py-1.5 rounded-full font-medium"
          aria-label="Voir un autre contenu"
        >
          Un autre !
        </button>
      </div>
      <p className="opacity-90 relative z-10 font-sans">
        {content.text}
      </p>
      {content.author && (
        <p className="mt-2 text-sm opacity-70 relative z-10 font-sans italic">
          — {content.author}
        </p>
      )}
      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-full blur-2xl transform translate-x-8 -translate-y-8" />
    </div>
  );
}
