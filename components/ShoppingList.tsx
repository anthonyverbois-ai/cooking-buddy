"use client";

import { useState, useMemo } from "react";
import type { Recipe, Ingredient } from "@/lib/types";
import { aggregateIngredients, groupByCategory, formatShoppingListText } from "@/lib/ingredients";

interface ShoppingListProps {
  recipes: Recipe[];
}

export function ShoppingList({ recipes }: ShoppingListProps) {
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);

  const allIngredients = useMemo(
    () => recipes.flatMap((r) => r.ingredients),
    [recipes]
  );

  const aggregated = useMemo(
    () => aggregateIngredients(allIngredients),
    [allIngredients]
  );

  const groups = useMemo(() => groupByCategory(aggregated), [aggregated]);

  const totalItems = aggregated.length;
  const checkedCount = checked.size;

  function toggleItem(key: string) {
    setChecked((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  function itemKey(item: { name: string; unit: string }) {
    return `${item.name.toLowerCase()}_${item.unit}`;
  }

  async function handleCopy() {
    const text = formatShoppingListText(groups);
    await navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <div className="space-y-6">
      {/* Header sticky avec copier + compteur */}
      <div className="sticky top-0 z-10 bg-cream pb-3 flex items-center justify-between">
        <p className="text-sm text-neutral-500 font-sans">
          {checkedCount}/{totalItems} articles cochés
        </p>
        <button
          onClick={handleCopy}
          className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium font-sans text-accent-orange hover:bg-primary-100 rounded-full transition-all duration-200"
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2" />
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
          </svg>
          {copied ? "Copié !" : "Copier"}
        </button>
      </div>

      {/* Groupes par catégorie */}
      {groups.map((group) => (
        <div key={group.category} className="space-y-2">
          <h3 className="text-xs font-semibold uppercase tracking-wider text-neutral-400 font-sans">
            {group.category}
          </h3>
          <div className="bg-white rounded-3xl shadow-card divide-y divide-primary-100">
            {group.items.map((item) => {
              const key = itemKey(item);
              const isChecked = checked.has(key);
              return (
                <label
                  key={key}
                  className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-colors hover:bg-primary-50"
                >
                  <input
                    type="checkbox"
                    checked={isChecked}
                    onChange={() => toggleItem(key)}
                    className="size-5 rounded-lg border-2 border-primary-100 text-primary-500 focus:ring-primary-500 accent-primary-500"
                  />
                  <span
                    className={`flex-1 text-sm font-sans transition-all duration-200 ${
                      isChecked ? "line-through text-neutral-400" : "text-neutral-700"
                    }`}
                  >
                    {item.name}
                  </span>
                  <span
                    className={`text-sm font-medium font-sans transition-all duration-200 ${
                      isChecked ? "text-neutral-300" : "text-neutral-500"
                    }`}
                  >
                    {item.quantity} {item.unit}
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
