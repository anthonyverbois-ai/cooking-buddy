import type { UserPreferences } from "./types";

export function buildBatchPrompt(
  preferences: UserPreferences,
  seasonIngredients: string[],
  pastTitles: string[],
  currentMonth: string
): string {
  const parts: string[] = [];

  parts.push(`Génère ${preferences.numberOfMeals} recettes batch cooking pour ${preferences.numberOfPersons} personnes, max ${preferences.maxTimePerMeal}min/recette, niveau ${preferences.cookingLevel || "intermédiaire"}, mois: ${currentMonth}.`);

  if (preferences.cuisine) {
    parts.push(`Inspiration cuisine: ${preferences.cuisine} (change un peu des classiques français).`);
  }

  if (preferences.objective === "sportif") {
    parts.push("Objectif SPORTIF: chaque recette DOIT avoir proteinSource renseigné.");
  }

  if (preferences.dietaryConstraints.length > 0) {
    parts.push(`Contraintes: ${preferences.dietaryConstraints.join(", ")}.`);
  }

  if (preferences.allergens.length > 0) {
    parts.push(`ALLERGÈNES INTERDITS (JAMAIS dans les ingrédients): ${preferences.allergens.join(", ")}.`);
  }

  if (preferences.equipment && preferences.equipment.length > 0) {
    parts.push(`Équipements: ${preferences.equipment.join(", ")}.`);
  }

  parts.push(`Saison: ${seasonIngredients.slice(0, 12).join(", ")}.`);

  if (pastTitles.length > 0) {
    parts.push(`Titres interdits (déjà faits): ${pastTitles.join(", ")}.`);
  }

  parts.push(`Règles: varier les plats, batch-friendly, étapes courtes (max 5), max 8 ingrédients/recette.`);

  parts.push(`Réponds UNIQUEMENT en JSON: un tableau d'objets avec les champs: id(uuid), title, description(1 phrase), prepTime, cookTime, totalTime, servings, difficulty("facile"|"moyen"), objective, proteinSource(string|null), season, ingredients([{name,quantity,unit("g"|"kg"|"ml"|"L"|"cl"|"pièce(s)"|"c. à soupe"|"c. à café"|"pincée"),category("légumes"|"fruits"|"viandes"|"poissons"|"produits laitiers"|"épicerie"|"surgelés"|"condiments"|"autres")}]), steps([string]), tags([string]), generatedAt(ISO).`);

  return parts.join("\n");
}

export function buildReplacePrompt(
  preferences: UserPreferences,
  seasonIngredients: string[],
  excludeTitles: string[],
  currentMonth: string
): string {
  return buildBatchPrompt(
    { ...preferences, numberOfMeals: 1 },
    seasonIngredients,
    excludeTitles,
    currentMonth
  );
}

const MONTH_NAMES = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

export function getCurrentMonthName(): string {
  return MONTH_NAMES[new Date().getMonth()];
}
