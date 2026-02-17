import {
  STORAGE_KEYS,
  type UserPreferences,
  type Batch,
  type RecipeHistory,
} from "./types";

function get<T>(key: string): T | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(key);
    return raw ? (JSON.parse(raw) as T) : null;
  } catch {
    return null;
  }
}

function set<T>(key: string, value: T): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(key, JSON.stringify(value));
}

function remove(key: string): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(key);
}

export function getPreferences(): UserPreferences | null {
  return get<UserPreferences>(STORAGE_KEYS.preferences);
}

export function setPreferences(prefs: UserPreferences): void {
  set(STORAGE_KEYS.preferences, prefs);
}

export function getCurrentBatch(): Batch | null {
  return get<Batch>(STORAGE_KEYS.currentBatch);
}

export function setCurrentBatch(batch: Batch): void {
  set(STORAGE_KEYS.currentBatch, batch);
}

export function getHistory(): RecipeHistory[] {
  return get<RecipeHistory[]>(STORAGE_KEYS.history) ?? [];
}

export function setHistory(history: RecipeHistory[]): void {
  set(STORAGE_KEYS.history, history);
}

export function getFavorites(): string[] {
  return get<string[]>(STORAGE_KEYS.favorites) ?? [];
}

export function setFavorites(ids: string[]): void {
  set(STORAGE_KEYS.favorites, ids);
}

export function getPastTitles(): string[] {
  return get<string[]>(STORAGE_KEYS.pastTitles) ?? [];
}

export function setPastTitles(titles: string[]): void {
  set(STORAGE_KEYS.pastTitles, titles);
}

export function toggleFavorite(recipeId: string): boolean {
  const favs = getFavorites();
  const isFav = favs.includes(recipeId);
  if (isFav) {
    setFavorites(favs.filter((id) => id !== recipeId));
  } else {
    setFavorites([...favs, recipeId]);
  }
  return !isFav;
}

export function markAsCooked(recipeId: string, recipeTitle: string): void {
  const history = getHistory();
  const existing = history.find((h) => h.recipeId === recipeId);
  if (existing) {
    existing.timesCooked += 1;
    existing.lastCookedAt = new Date().toISOString();
    setHistory(history);
  } else {
    setHistory([
      ...history,
      {
        recipeId,
        recipeTitle,
        timesCooked: 1,
        lastCookedAt: new Date().toISOString(),
        isFavorite: getFavorites().includes(recipeId),
      },
    ]);
  }
}

export function getAllSavedRecipes(): { recipes: import("./types").Recipe[]; batch: Batch | null } {
  const batch = getCurrentBatch();
  return { recipes: batch?.recipes ?? [], batch };
}

export function resetAll(): void {
  Object.values(STORAGE_KEYS).forEach(remove);
}
