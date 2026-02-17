"use client";

import type { Recipe } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";

interface RecipeCardProps {
  recipe: Recipe;
  onView: (recipe: Recipe) => void;
  onReplace?: (recipe: Recipe) => void;
  replacing?: boolean;
  isFavorite?: boolean;
  onToggleFavorite?: (recipe: Recipe) => void;
  cookedCount?: number;
}

export function RecipeCard({
  recipe,
  onView,
  onReplace,
  replacing,
  isFavorite,
  onToggleFavorite,
  cookedCount,
}: RecipeCardProps) {
  return (
    <div className="w-full bg-white rounded-3xl p-5 shadow-card hover:shadow-card-hover transition space-y-3">
      <div className="flex items-start justify-between gap-2">
        <button
          type="button"
          onClick={() => onView(recipe)}
          className="flex-1 text-left space-y-3"
        >
          <h3 className="font-bold text-primary-500 leading-tight font-sans">
            {recipe.title}
          </h3>

          <p className="text-sm text-neutral-500 line-clamp-2 font-sans">
            {recipe.description}
          </p>
        </button>

        {onToggleFavorite && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(recipe);
            }}
            className="flex-shrink-0 p-1 transition-all duration-200"
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
              className={`size-5 transition-colors duration-200 ${
                isFavorite ? "text-accent-orange" : "text-neutral-300 hover:text-accent-orange"
              }`}
            >
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
            </svg>
          </button>
        )}
      </div>

      <button
        type="button"
        onClick={() => onView(recipe)}
        className="w-full text-left space-y-3"
      >
        <div className="flex items-center gap-3 text-xs text-neutral-500 font-sans">
          <span className="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            {recipe.totalTime} min
          </span>
          <span>{recipe.difficulty}</span>
          {recipe.proteinSource && (
            <span className="text-accent-orange font-medium">
              {recipe.proteinSource}
            </span>
          )}
          {cookedCount && cookedCount > 0 && (
            <span className="text-season-600 font-medium">
              Cuisinée {cookedCount}x
            </span>
          )}
        </div>

        <div className="flex flex-wrap gap-1.5">
          {recipe.tags.slice(0, 3).map((tag) => (
            <Badge key={tag} variant="default">
              {tag}
            </Badge>
          ))}
        </div>
      </button>

      {onReplace && (
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onReplace(recipe);
          }}
          disabled={replacing}
          className="w-full flex items-center justify-center gap-1.5 py-1.5 text-xs font-medium font-sans text-neutral-500 hover:text-accent-orange hover:bg-primary-50 rounded-full transition-all duration-200 disabled:opacity-50"
        >
          {replacing ? (
            <>
              <div className="size-3 animate-spin rounded-full border-2 border-primary-100 border-t-accent-orange" />
              Remplacement...
            </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-3.5">
                <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8M3 22v-6h6M21 12a9 9 0 0 1-15 6.7L3 16" />
              </svg>
              Remplacer
            </>
          )}
        </button>
      )}
    </div>
  );
}
