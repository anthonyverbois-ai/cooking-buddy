"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { getFavorites, getCurrentBatch, toggleFavorite, getHistory } from "@/lib/storage";
import { RecipeCard } from "@/components/RecipeCard";
import type { Recipe, RecipeHistory } from "@/lib/types";

export default function FavorisPage() {
  const router = useRouter();
  const [favoriteRecipes, setFavoriteRecipes] = useState<Recipe[]>([]);
  const [favorites, setFavoritesState] = useState<string[]>([]);
  const [history, setHistoryState] = useState<RecipeHistory[]>([]);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    const favIds = getFavorites();
    const batch = getCurrentBatch();
    const hist = getHistory();
    setFavoritesState(favIds);
    setHistoryState(hist);

    // Find favorite recipes from current batch
    if (batch) {
      const favRecipes = batch.recipes.filter((r) => favIds.includes(r.id));
      setFavoriteRecipes(favRecipes);
    }
    setMounted(true);
  }, []);

  function handleViewRecipe(recipe: Recipe) {
    router.push(`/batch/${recipe.id}`);
  }

  function handleToggleFavorite(recipe: Recipe) {
    const nowFav = toggleFavorite(recipe.id);
    if (!nowFav) {
      setFavoriteRecipes((prev) => prev.filter((r) => r.id !== recipe.id));
      setFavoritesState((prev) => prev.filter((id) => id !== recipe.id));
    }
  }

  if (!mounted) return null;

  if (favoriteRecipes.length === 0) {
    return (
      <div className="space-y-8">
        <h1 className="text-2xl text-primary-500 tracking-tight">Mes favoris</h1>
        <div className="bg-primary-100 rounded-3xl p-8 text-center space-y-2">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-10 mx-auto text-neutral-400">
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
          </svg>
          <p className="text-neutral-500 font-sans">Aucun favori pour le moment.</p>
          <p className="text-sm text-neutral-400 font-sans">
            Appuyez sur le coeur d&apos;une recette pour l&apos;ajouter ici.
          </p>
        </div>
        <Link href="/historique" className="block text-center text-sm text-accent-orange font-medium hover:text-accent-orange/80 transition-colors duration-200 font-sans">
          Voir mon historique de recettes cuisinées
        </Link>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      <div>
        <h1 className="text-2xl text-primary-500 tracking-tight">Mes favoris</h1>
        <p className="mt-1 text-sm text-neutral-500 font-sans">
          {favoriteRecipes.length} recette{favoriteRecipes.length > 1 ? "s" : ""} sauvegardée{favoriteRecipes.length > 1 ? "s" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {favoriteRecipes.map((recipe) => (
          <RecipeCard
            key={recipe.id}
            recipe={recipe}
            onView={handleViewRecipe}
            isFavorite={favorites.includes(recipe.id)}
            onToggleFavorite={handleToggleFavorite}
            cookedCount={history.find((h) => h.recipeId === recipe.id)?.timesCooked}
          />
        ))}
      </div>

      <Link href="/historique" className="block text-center text-sm text-accent-orange font-medium hover:text-accent-orange/80 transition-colors duration-200 font-sans">
        Voir mon historique de recettes cuisinées
      </Link>
    </div>
  );
}
