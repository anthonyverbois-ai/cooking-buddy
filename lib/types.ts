export interface UserPreferences {
  numberOfMeals: number;
  numberOfPersons: number;
  maxTimePerMeal: number;
  objective: "normal" | "sportif";
  dietaryConstraints: string[];
  allergens: string[];
  cookingLevel?: "débutant" | "intermédiaire" | "confirmé";
  equipment?: string[];
  cuisine?: string;
}

export interface Ingredient {
  name: string;
  quantity: number;
  unit:
  | "g"
  | "kg"
  | "ml"
  | "L"
  | "cl"
  | "pièce(s)"
  | "c. à soupe"
  | "c. à café"
  | "pincée";
  category:
  | "légumes"
  | "fruits"
  | "viandes"
  | "poissons"
  | "produits laitiers"
  | "épicerie"
  | "surgelés"
  | "condiments"
  | "autres";
}

export interface Recipe {
  id: string;
  title: string;
  description: string;
  prepTime: number;
  cookTime: number;
  totalTime: number;
  servings: number;
  difficulty: "facile" | "moyen";
  objective: "normal" | "sportif";
  proteinSource?: string;
  season: string;
  ingredients: Ingredient[];
  steps: string[];
  tags: string[];
  generatedAt: string;
}

export interface Batch {
  id: string;
  recipes: Recipe[];
  preferences: UserPreferences;
  createdAt: string;
  validated: boolean;
}

export interface RecipeHistory {
  recipeId: string;
  recipeTitle: string;
  timesCooked: number;
  lastCookedAt: string;
  isFavorite: boolean;
  rating?: number;
}

export const STORAGE_KEYS = {
  preferences: "solodad_preferences",
  currentBatch: "solodad_current_batch",
  history: "solodad_history",
  favorites: "solodad_favorites",
  pastTitles: "solodad_past_titles",
} as const;
