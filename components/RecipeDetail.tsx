"use client";

import type { Recipe } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

interface RecipeDetailProps {
  recipe: Recipe;
  isFavorite?: boolean;
  onToggleFavorite?: () => void;
  onMarkCooked?: () => void;
  cookedCount?: number;
}

export function RecipeDetail({
  recipe,
  isFavorite,
  onToggleFavorite,
  onMarkCooked,
  cookedCount,
}: RecipeDetailProps) {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-3">
          <h1 className="text-2xl text-primary-500 tracking-tight">{recipe.title}</h1>
          {onToggleFavorite && (
            <button
              type="button"
              onClick={onToggleFavorite}
              className="flex-shrink-0 p-1"
              aria-label={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 24 24"
                fill={isFavorite ? "currentColor" : "none"}
                stroke="currentColor"
                strokeWidth={1.5}
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`size-6 transition-colors duration-200 ${
                  isFavorite ? "text-accent-orange" : "text-neutral-300 hover:text-accent-orange"
                }`}
              >
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
              </svg>
            </button>
          )}
        </div>
        <p className="text-neutral-500 font-sans">{recipe.description}</p>
      </div>

      {/* Meta */}
      <div className="flex flex-wrap gap-3 text-sm font-sans">
        <div className="flex items-center gap-1.5 text-neutral-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <circle cx="12" cy="12" r="10" />
            <polyline points="12 6 12 12 16 14" />
          </svg>
          <span>Prépa {recipe.prepTime} min</span>
        </div>
        <div className="flex items-center gap-1.5 text-neutral-600">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="M12 2v10l4.24 4.24" />
            <circle cx="12" cy="12" r="10" />
          </svg>
          <span>Cuisson {recipe.cookTime} min</span>
        </div>
        <div className="font-semibold text-accent-orange">
          Total {recipe.totalTime} min
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        <Badge variant="primary">{recipe.difficulty}</Badge>
        <Badge variant="season">{recipe.season}</Badge>
        {recipe.proteinSource && (
          <Badge variant="accent">{recipe.proteinSource}</Badge>
        )}
        {recipe.tags.map((tag) => (
          <Badge key={tag}>{tag}</Badge>
        ))}
      </div>

      {/* Portions */}
      <div className="text-sm text-neutral-600 font-sans">
        Pour <span className="font-semibold text-primary-500">{recipe.servings}</span> personnes
        {cookedCount && cookedCount > 0 && (
          <span className="ml-3 text-season-600 font-medium">
            Cuisinée {cookedCount} fois
          </span>
        )}
      </div>

      {/* Actions */}
      {onMarkCooked && (
        <Button variant="secondary" size="sm" onClick={onMarkCooked}>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
          Marquer comme cuisinée
        </Button>
      )}

      {/* Ingrédients */}
      <div className="bg-white rounded-3xl p-5 shadow-card space-y-4">
        <h2 className="text-lg text-primary-500">Ingrédients</h2>
        <ul className="space-y-1.5">
          {recipe.ingredients.map((ing, i) => (
            <li key={i} className="flex justify-between text-sm py-1.5 border-b border-primary-100 last:border-0 font-sans">
              <span className="text-neutral-700">{ing.name}</span>
              <span className="text-neutral-500 font-medium">
                {ing.quantity} {ing.unit}
              </span>
            </li>
          ))}
        </ul>
      </div>

      {/* Étapes */}
      <div className="bg-white rounded-3xl p-5 shadow-card space-y-4">
        <h2 className="text-lg text-primary-500">Préparation</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, i) => (
            <li key={i} className="flex gap-3">
              <span className="flex-shrink-0 flex items-center justify-center size-7 rounded-full bg-accent-orange text-white text-sm font-bold font-sans">
                {i + 1}
              </span>
              <p className="text-neutral-700 text-base leading-relaxed pt-0.5 font-sans">
                {step}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </div>
  );
}
