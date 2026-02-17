"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getHistory, getCurrentBatch } from "@/lib/storage";
import type { RecipeHistory, Recipe } from "@/lib/types";

export default function HistoriquePage() {
  const router = useRouter();
  const [history, setHistoryState] = useState<RecipeHistory[]>([]);
  const [recipes, setRecipes] = useState<Map<string, Recipe>>(new Map());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const hist = getHistory();
    setHistoryState(hist.sort((a, b) => b.lastCookedAt.localeCompare(a.lastCookedAt)));

    // Map recipe IDs to full recipes from current batch
    const batch = getCurrentBatch();
    if (batch) {
      const map = new Map<string, Recipe>();
      for (const r of batch.recipes) {
        map.set(r.id, r);
      }
      setRecipes(map);
    }
    setMounted(true);
  }, []);

  function formatDate(iso: string): string {
    return new Date(iso).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  }

  function handleViewRecipe(recipeId: string) {
    if (recipes.has(recipeId)) {
      router.push(`/batch/${recipeId}`);
    }
  }

  if (!mounted) return null;

  if (history.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl text-primary-500 tracking-tight">Historique</h1>
        <div className="bg-primary-100 rounded-3xl p-8 text-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-10 mx-auto text-neutral-400">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <p className="text-neutral-500 font-sans">Aucune recette cuisinée pour le moment.</p>
          <p className="text-sm text-neutral-400 font-sans">
            Marquez vos recettes comme cuisinées depuis la page détail.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl text-primary-500 tracking-tight">Historique</h1>
        <p className="mt-1 text-sm text-neutral-500 font-sans">
          {history.length} recette{history.length > 1 ? "s" : ""} cuisinée{history.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="space-y-3">
        {history.map((entry) => {
          const hasFullRecipe = recipes.has(entry.recipeId);
          return (
            <button
              key={entry.recipeId}
              onClick={() => handleViewRecipe(entry.recipeId)}
              disabled={!hasFullRecipe}
              className="w-full text-left bg-white rounded-3xl p-4 shadow-card hover:shadow-card-hover transition disabled:opacity-60 disabled:cursor-default"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-primary-500 leading-tight truncate font-sans">
                    {entry.recipeTitle}
                  </h3>
                  <p className="mt-1 text-xs text-neutral-400 font-sans">
                    Dernière fois le {formatDate(entry.lastCookedAt)}
                  </p>
                </div>
                <div className="flex-shrink-0 flex items-center gap-2">
                  <span className="inline-flex items-center gap-1 rounded-full bg-season-100 px-2.5 py-0.5 text-xs font-medium text-season-700 font-sans">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" className="size-3">
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                    {entry.timesCooked}x
                  </span>
                  {hasFullRecipe && (
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4 text-neutral-400">
                      <path d="M9 18l6-6-6-6" />
                    </svg>
                  )}
                </div>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}
