"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { getCurrentBatch, getFavorites, toggleFavorite, markAsCooked, getHistory } from "@/lib/storage";
import { RecipeDetail } from "@/components/RecipeDetail";
import { AssistantChat } from "@/components/AssistantChat";
import { Button } from "@/components/ui/Button";
import type { Recipe } from "@/lib/types";

export default function RecipeDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [mounted, setMounted] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [cookedCount, setCookedCount] = useState(0);

  useEffect(() => {
    const batch = getCurrentBatch();
    if (batch) {
      const found = batch.recipes.find((r) => r.id === params.id);
      setRecipe(found ?? null);
      if (found) {
        setIsFavorite(getFavorites().includes(found.id));
        const hist = getHistory().find((h) => h.recipeId === found.id);
        setCookedCount(hist?.timesCooked ?? 0);
      }
    }
    setMounted(true);
  }, [params.id]);

  function handleToggleFavorite() {
    if (!recipe) return;
    const nowFav = toggleFavorite(recipe.id);
    setIsFavorite(nowFav);
  }

  function handleMarkCooked() {
    if (!recipe) return;
    markAsCooked(recipe.id, recipe.title);
    setCookedCount((c) => c + 1);
  }

  if (!mounted) return null;

  if (!recipe) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl text-primary-500 tracking-tight">Recette introuvable</h1>
        <p className="text-neutral-500 font-sans">Cette recette n&apos;existe pas ou le batch a été supprimé.</p>
        <Button variant="secondary" onClick={() => router.push("/batch")}>
          Retour au batch
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <button
        onClick={() => router.push("/batch")}
        className="flex items-center gap-1 text-sm text-neutral-500 hover:text-primary-500 transition-colors font-sans"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4">
          <path d="M15 18l-6-6 6-6" />
        </svg>
        Retour au batch
      </button>

      <RecipeDetail
        recipe={recipe}
        isFavorite={isFavorite}
        onToggleFavorite={handleToggleFavorite}
        onMarkCooked={handleMarkCooked}
        cookedCount={cookedCount}
      />

      <AssistantChat recipe={recipe} />
    </div>
  );
}
