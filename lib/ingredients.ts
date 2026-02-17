import type { Ingredient } from "./types";

/** Convertit en unité de base pour permettre la fusion (g, ml) */
const UNIT_TO_BASE: Record<string, { base: string; factor: number }> = {
  g: { base: "g", factor: 1 },
  kg: { base: "g", factor: 1000 },
  ml: { base: "ml", factor: 1 },
  L: { base: "ml", factor: 1000 },
  cl: { base: "ml", factor: 10 },
};

function normalizeKey(name: string): string {
  return name.toLowerCase().trim().replace(/\s+/g, " ");
}

interface AggregatedIngredient extends Ingredient {
  checked?: boolean;
}

/**
 * Agrège les ingrédients de plusieurs recettes :
 * - Fusionne les doublons (même nom normalisé)
 * - Convertit les unités compatibles
 * - Regroupe par catégorie
 */
export function aggregateIngredients(
  allIngredients: Ingredient[]
): AggregatedIngredient[] {
  const map = new Map<
    string,
    { name: string; quantity: number; baseUnit: string; unit: Ingredient["unit"]; category: Ingredient["category"] }
  >();

  for (const ing of allIngredients) {
    const key = normalizeKey(ing.name);
    const existing = map.get(key);

    const conversion = UNIT_TO_BASE[ing.unit];

    if (existing) {
      const existingConversion = UNIT_TO_BASE[existing.unit];

      // Si les deux sont convertibles vers la même base
      if (
        conversion &&
        existingConversion &&
        conversion.base === existingConversion.base
      ) {
        existing.quantity += ing.quantity * conversion.factor;
        // Garder en unité de base
        existing.baseUnit = conversion.base;
      } else if (existing.unit === ing.unit) {
        // Même unité non convertible → additionner
        existing.quantity += ing.quantity;
      } else {
        // Unités incompatibles → suffixer le nom
        const altKey = `${key}_${ing.unit}`;
        const altExisting = map.get(altKey);
        if (altExisting) {
          altExisting.quantity += ing.quantity;
        } else {
          map.set(altKey, {
            name: ing.name,
            quantity: ing.quantity,
            baseUnit: ing.unit,
            unit: ing.unit,
            category: ing.category,
          });
        }
      }
    } else {
      map.set(key, {
        name: ing.name,
        quantity: conversion ? ing.quantity * conversion.factor : ing.quantity,
        baseUnit: conversion ? conversion.base : ing.unit,
        unit: ing.unit,
        category: ing.category,
      });
    }
  }

  // Convertir vers des unités plus lisibles
  const result: AggregatedIngredient[] = [];

  for (const item of map.values()) {
    let finalQuantity = item.quantity;
    let finalUnit = item.unit;

    if (item.baseUnit === "g") {
      if (finalQuantity >= 1000) {
        finalQuantity = Math.round((finalQuantity / 1000) * 100) / 100;
        finalUnit = "kg";
      } else {
        finalQuantity = Math.round(finalQuantity);
        finalUnit = "g";
      }
    } else if (item.baseUnit === "ml") {
      if (finalQuantity >= 1000) {
        finalQuantity = Math.round((finalQuantity / 1000) * 100) / 100;
        finalUnit = "L";
      } else if (finalQuantity >= 10 && finalQuantity % 10 === 0) {
        finalQuantity = Math.round(finalQuantity / 10);
        finalUnit = "cl";
      } else {
        finalQuantity = Math.round(finalQuantity);
        finalUnit = "ml";
      }
    } else {
      finalQuantity = Math.round(finalQuantity * 100) / 100;
    }

    result.push({
      name: item.name,
      quantity: finalQuantity,
      unit: finalUnit as Ingredient["unit"],
      category: item.category,
    });
  }

  return result;
}

/** Ordre de tri des catégories pour l'affichage en magasin */
const CATEGORY_ORDER: Ingredient["category"][] = [
  "légumes",
  "fruits",
  "viandes",
  "poissons",
  "produits laitiers",
  "épicerie",
  "surgelés",
  "condiments",
  "autres",
];

/**
 * Regroupe les ingrédients par catégorie, triés dans l'ordre du magasin.
 */
export function groupByCategory(
  ingredients: AggregatedIngredient[]
): { category: Ingredient["category"]; items: AggregatedIngredient[] }[] {
  const groups = new Map<Ingredient["category"], AggregatedIngredient[]>();

  for (const ing of ingredients) {
    const existing = groups.get(ing.category) ?? [];
    existing.push(ing);
    groups.set(ing.category, existing);
  }

  return CATEGORY_ORDER
    .filter((cat) => groups.has(cat))
    .map((cat) => ({
      category: cat,
      items: groups.get(cat)!.sort((a, b) => a.name.localeCompare(b.name, "fr")),
    }));
}

/**
 * Formate la liste de courses en texte brut pour le presse-papier.
 */
export function formatShoppingListText(
  groups: { category: Ingredient["category"]; items: AggregatedIngredient[] }[]
): string {
  return groups
    .map(
      (g) =>
        `--- ${g.category.toUpperCase()} ---\n` +
        g.items.map((i) => `- ${i.name} : ${i.quantity} ${i.unit}`).join("\n")
    )
    .join("\n\n");
}
