"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import {
  getCurrentBatch,
  setCurrentBatch,
  setPastTitles,
  getPastTitles,
  getFavorites,
  toggleFavorite,
  getHistory,
} from "@/lib/storage";
import { RecipeCard } from "@/components/RecipeCard";
import { Button } from "@/components/ui/Button";
import { ExportMarkdown } from "@/components/ExportMarkdown";
import type { Batch, Recipe, RecipeHistory } from "@/lib/types";

export default function BatchPage() {
  const router = useRouter();
  const [batch, setBatch] = useState<Batch | null>(null);
  const [mounted, setMounted] = useState(false);
  const [replacingId, setReplacingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [favorites, setFavoritesState] = useState<string[]>([]);
  const [history, setHistoryState] = useState<RecipeHistory[]>([]);

  useEffect(() => {
    setBatch(getCurrentBatch());
    setFavoritesState(getFavorites());
    setHistoryState(getHistory());
    setMounted(true);
  }, []);

  function handleViewRecipe(recipe: Recipe) {
    router.push(`/batch/${recipe.id}`);
  }

  function handleToggleFavorite(recipe: Recipe) {
    const nowFav = toggleFavorite(recipe.id);
    setFavoritesState(nowFav ? [...favorites, recipe.id] : favorites.filter((id) => id !== recipe.id));
  }

  async function handleReplace(recipe: Recipe) {
    if (!batch) return;
    setReplacingId(recipe.id);
    setError(null);

    try {
      const excludeTitles = [
        ...batch.recipes.map((r) => r.title),
        ...getPastTitles(),
      ];

      const res = await fetch("/api/replace-recipe", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          preferences: batch.preferences,
          excludeTitles,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors du remplacement.");
      }

      if (data.allergenWarnings?.length > 0) {
        setError("Attention : " + data.allergenWarnings.join("\n"));
      }

      const newRecipes = batch.recipes.map((r) =>
        r.id === recipe.id ? data.recipe : r
      );
      const updatedBatch = { ...batch, recipes: newRecipes };
      setBatch(updatedBatch);
      setCurrentBatch(updatedBatch);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Erreur lors du remplacement."
      );
    } finally {
      setReplacingId(null);
    }
  }

  function handleValidate() {
    if (!batch) return;

    const validatedBatch = { ...batch, validated: true };
    setCurrentBatch(validatedBatch);
    setBatch(validatedBatch);

    // Save titles for anti-duplication
    const existing = getPastTitles();
    const newTitles = batch.recipes.map((r) => r.title);
    setPastTitles([...existing, ...newTitles]);
  }

  if (!mounted) return null;

  if (!batch || batch.recipes.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl text-primary-500 tracking-tight">Mon batch</h1>
        <div className="bg-primary-100 rounded-3xl p-8 text-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-10 mx-auto text-neutral-400">
            <path d="M8 6h13M8 12h13M8 18h13M3 6h.01M3 12h.01M3 18h.01" />
          </svg>
          <p className="text-neutral-500 font-sans">Aucun batch en cours.</p>
          <p className="text-sm text-neutral-400 font-sans">
            Allez dans &quot;Nouveau&quot; pour générer vos recettes.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5 pb-4">
      <div>
        <h1 className="text-2xl text-primary-500 tracking-tight">Mon batch</h1>
        <p className="mt-1 text-sm text-neutral-500 font-sans">
          {batch.recipes.length} recettes pour {batch.preferences.numberOfPersons} personnes
          {batch.validated && (
            <span className="ml-2 inline-flex items-center rounded-full bg-season-100 px-2 py-0.5 text-xs font-medium text-season-700">
              Validé
            </span>
          )}
        </p>
        {batch.validated && (
          <ExportMarkdown recipes={batch.recipes} />
        )}
      </div>

      {error && (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-3 text-sm text-red-700 whitespace-pre-line font-sans">
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {batch.recipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onView={handleViewRecipe}
            onReplace={!batch.validated ? handleReplace : undefined}
            replacing={replacingId === recipe.id}
            isFavorite={favorites.includes(recipe.id)}
            onToggleFavorite={handleToggleFavorite}
            cookedCount={history.find((h) => h.recipeId === recipe.id)?.timesCooked}
          />
        ))}
      </div>

      {!batch.validated && (
        <div className="sticky bottom-24 pt-3">
          <Button
            size="lg"
            className="w-full"
            onClick={handleValidate}
          >
            Valider le batch
          </Button>
        </div>
      )}
    </div>
  );
}
