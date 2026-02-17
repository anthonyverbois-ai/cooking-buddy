import type { Recipe, Ingredient } from "./types";

const UNIT_MAP: Record<string, Ingredient["unit"]> = {
  "g": "g",
  "gr": "g",
  "gramme": "g",
  "grammes": "g",
  "kg": "kg",
  "kilo": "kg",
  "kilos": "kg",
  "kilogramme": "kg",
  "kilogrammes": "kg",
  "ml": "ml",
  "millilitre": "ml",
  "millilitres": "ml",
  "l": "L",
  "litre": "L",
  "litres": "L",
  "cl": "cl",
  "centilitre": "cl",
  "centilitres": "cl",
  "pièce": "pièce(s)",
  "pièces": "pièce(s)",
  "pièce(s)": "pièce(s)",
  "piece": "pièce(s)",
  "pieces": "pièce(s)",
  "unité": "pièce(s)",
  "unités": "pièce(s)",
  "c. à soupe": "c. à soupe",
  "c.à": "c. à soupe",
  "cuillère à soupe": "c. à soupe",
  "cuillères à soupe": "c. à soupe",
  "cas": "c. à soupe",
  "c. à café": "c. à café",
  "cuillère à café": "c. à café",
  "cuillères à café": "c. à café",
  "cac": "c. à café",
  "pincée": "pincée",
  "pincées": "pincée",
};

const CATEGORY_MAP: Record<string, Ingredient["category"]> = {
  "légumes": "légumes",
  "légume": "légumes",
  "legumes": "légumes",
  "legume": "légumes",
  "fruits": "fruits",
  "fruit": "fruits",
  "viandes": "viandes",
  "viande": "viandes",
  "poissons": "poissons",
  "poisson": "poissons",
  "produits laitiers": "produits laitiers",
  "produit laitier": "produits laitiers",
  "laitier": "produits laitiers",
  "laitiers": "produits laitiers",
  "épicerie": "épicerie",
  "epicerie": "épicerie",
  "surgelés": "surgelés",
  "surgelé": "surgelés",
  "surgeles": "surgelés",
  "condiments": "condiments",
  "condiment": "condiments",
  "autres": "autres",
  "autre": "autres",
};

function normalizeIngredient(ing: Record<string, unknown>): Ingredient | null {
  const name = typeof ing.name === "string" ? ing.name.trim() : "";
  if (!name) return null;

  const quantity = typeof ing.quantity === "number" ? ing.quantity :
    typeof ing.quantity === "string" ? parseFloat(ing.quantity) : 0;
  if (!quantity || quantity <= 0) return null;

  const rawUnit = (typeof ing.unit === "string" ? ing.unit.trim().toLowerCase() : "");
  const unit = UNIT_MAP[rawUnit] || "pièce(s)";

  const rawCategory = (typeof ing.category === "string" ? ing.category.trim().toLowerCase() : "");
  const category = CATEGORY_MAP[rawCategory] || "autres";

  return { name, quantity, unit, category };
}

function normalizeRecipe(raw: Record<string, unknown>): Recipe | null {
  const title = typeof raw.title === "string" ? raw.title.trim() : "";
  if (!title) return null;

  const ingredients = Array.isArray(raw.ingredients)
    ? raw.ingredients
      .map((i: unknown) => normalizeIngredient(i as Record<string, unknown>))
      .filter((i): i is Ingredient => i !== null)
    : [];
  if (ingredients.length === 0) return null;

  const steps = Array.isArray(raw.steps)
    ? raw.steps.filter((s: unknown) => typeof s === "string" && s.trim().length > 0) as string[]
    : [];
  if (steps.length === 0) return null;

  const prepTime = typeof raw.prepTime === "number" ? raw.prepTime : 0;
  const cookTime = typeof raw.cookTime === "number" ? raw.cookTime : 0;

  return {
    id: typeof raw.id === "string" ? raw.id : crypto.randomUUID(),
    title,
    description: typeof raw.description === "string" ? raw.description : title,
    prepTime,
    cookTime,
    totalTime: typeof raw.totalTime === "number" ? raw.totalTime : prepTime + cookTime,
    servings: typeof raw.servings === "number" ? raw.servings : 4,
    difficulty: raw.difficulty === "moyen" ? "moyen" : "facile",
    objective: raw.objective === "sportif" ? "sportif" : "normal",
    proteinSource: typeof raw.proteinSource === "string" ? raw.proteinSource : undefined,
    season: typeof raw.season === "string" ? raw.season : "",
    ingredients,
    steps,
    tags: Array.isArray(raw.tags)
      ? raw.tags.filter((t: unknown) => typeof t === "string") as string[]
      : [],
    generatedAt: typeof raw.generatedAt === "string"
      ? raw.generatedAt
      : new Date().toISOString(),
  };
}

export function parseAndValidateRecipes(raw: string): Recipe[] {
  let jsonStr = raw.trim();

  // Extract from markdown code block
  const codeBlockMatch = jsonStr.match(/```(?:json)?\s*([\s\S]*?)```/);
  if (codeBlockMatch) {
    jsonStr = codeBlockMatch[1].trim();
  }

  // Extract JSON array from surrounding text
  const startIdx = jsonStr.indexOf("[");
  const endIdx = jsonStr.lastIndexOf("]");
  if (startIdx !== -1 && endIdx > startIdx) {
    jsonStr = jsonStr.slice(startIdx, endIdx + 1);
  }

  const parsed = JSON.parse(jsonStr);

  // Handle single object
  const items = Array.isArray(parsed) ? parsed : [parsed];

  const recipes = items
    .map((item: unknown) => normalizeRecipe(item as Record<string, unknown>))
    .filter((r): r is Recipe => r !== null);

  if (recipes.length === 0) {
    throw new Error("Aucune recette valide trouvée.");
  }

  return recipes;
}

const ALLERGEN_KEYWORDS: Record<string, string[]> = {
  arachide: ["arachide", "cacahuète", "cacahuete"],
  gluten: ["gluten", "blé", "ble", "seigle", "orge", "avoine", "épeautre", "epeautre"],
  lait: ["lait", "lactose", "fromage", "crème", "creme", "beurre", "yaourt", "yogourt", "mascarpone", "mozzarella", "parmesan", "gruyère", "gruyere", "emmental", "comté", "comte", "reblochon", "camembert", "chèvre", "chevre", "ricotta"],
  oeuf: ["oeuf", "œuf"],
  soja: ["soja", "tofu", "edamame"],
  "fruits à coque": ["noix", "noisette", "amande", "cajou", "pistache", "pécan", "pecan", "macadamia"],
  poisson: ["poisson", "saumon", "thon", "cabillaud", "merlu", "sardine", "maquereau", "truite", "bar", "dorade", "sole", "colin"],
  crustacé: ["crustacé", "crustace", "crevette", "homard", "crabe", "langoustine", "écrevisse", "ecrevisse"],
  mollusque: ["mollusque", "moule", "huître", "huitre", "calamar", "poulpe", "seiche", "escargot"],
  sésame: ["sésame", "sesame"],
  céleri: ["céleri", "celeri"],
  moutarde: ["moutarde"],
  lupin: ["lupin"],
  sulfites: ["sulfite", "sulfites"],
};

export function checkAllergens(
  recipes: Recipe[],
  userAllergens: string[]
): { safe: boolean; warnings: string[] } {
  if (userAllergens.length === 0) return { safe: true, warnings: [] };

  const warnings: string[] = [];

  const keywordsToCheck: string[] = [];
  for (const allergen of userAllergens) {
    const lower = allergen.toLowerCase().trim();
    for (const [group, keywords] of Object.entries(ALLERGEN_KEYWORDS)) {
      if (lower.includes(group) || keywords.some((k) => lower.includes(k))) {
        keywordsToCheck.push(...keywords);
      }
    }
    if (!keywordsToCheck.includes(lower)) {
      keywordsToCheck.push(lower);
    }
  }

  for (const recipe of recipes) {
    for (const ingredient of recipe.ingredients) {
      const ingredientName = ingredient.name.toLowerCase();
      for (const keyword of keywordsToCheck) {
        if (ingredientName.includes(keyword)) {
          warnings.push(
            `"${recipe.title}" contient "${ingredient.name}" (allergène: ${keyword})`
          );
        }
      }
    }
  }

  return { safe: warnings.length === 0, warnings };
}
