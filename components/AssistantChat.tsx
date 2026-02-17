"use client";

import { useState } from "react";
import type { Recipe } from "@/lib/types";

interface AssistantChatProps {
  recipe: Recipe;
}

export function AssistantChat({ recipe }: AssistantChatProps) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleAsk(e: React.FormEvent) {
    e.preventDefault();
    if (!question.trim() || loading) return;

    setLoading(true);
    setError(null);
    setAnswer(null);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: question.trim(), recipe }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur.");
      }

      setAnswer(data.answer);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Erreur de connexion.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="bg-white rounded-3xl p-5 shadow-card space-y-4">
      <h2 className="text-lg text-primary-500">Une question ?</h2>
      <p className="text-xs text-neutral-400 font-sans">
        Substitution, cuisson, portions... posez votre question sur cette recette.
      </p>

      <form onSubmit={handleAsk} className="flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder="Ex: Par quoi remplacer la crème ?"
          className="flex-1 px-4 py-2.5 text-sm font-sans bg-primary-50 rounded-full border border-primary-100 outline-none focus:border-primary-500 placeholder:text-neutral-400 transition-all duration-200"
        />
        <button
          type="submit"
          disabled={loading || !question.trim()}
          className="px-4 py-2.5 bg-accent-yellow text-primary-700 text-sm font-semibold rounded-full hover:brightness-105 transition-all duration-200 disabled:opacity-50 disabled:pointer-events-none"
        >
          {loading ? (
            <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-4">
              <line x1="22" y1="2" x2="11" y2="13" />
              <polygon points="22 2 15 22 11 13 2 9 22 2" />
            </svg>
          )}
        </button>
      </form>

      {error && (
        <p className="text-sm text-red-500 font-sans">{error}</p>
      )}

      {answer && (
        <div className="bg-primary-50 rounded-2xl p-4 border border-primary-100">
          <p className="text-sm text-neutral-700 leading-relaxed font-sans">{answer}</p>
        </div>
      )}
    </div>
  );
}
