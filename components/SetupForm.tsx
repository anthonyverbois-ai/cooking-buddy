"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/Button";
import { Loader } from "@/components/ui/Loader";
import { getPreferences, setPreferences, setCurrentBatch, getPastTitles } from "@/lib/storage";
import type { UserPreferences, Batch } from "@/lib/types";

const DIETARY_OPTIONS = [
  "Végétarien",
  "Végan",
  "Sans gluten",
  "Sans lactose",
  "Halal",
  "Sans porc",
];

const ALLERGEN_OPTIONS = [
  "Arachide",
  "Gluten",
  "Lait",
  "Œuf",
  "Soja",
  "Fruits à coque",
  "Poisson",
  "Crustacé",
  "Sésame",
  "Céleri",
  "Moutarde",
];

const CUISINE_OPTIONS = [
  "Thaïlandaise",
  "Africaine",
  "Italienne",
  "Indienne",
  "Mexicaine",
  "Japonaise",
  "Libanaise",
  "Marocaine",
];

const EQUIPMENT_OPTIONS = [
  "Four",
  "Mixeur / Blender",
  "Cocotte",
  "Poêle",
  "Casserole",
  "Wok",
  "Robot culinaire",
  "Autocuiseur",
];

const DEFAULT_PREFERENCES: UserPreferences = {
  numberOfMeals: 4,
  numberOfPersons: 4,
  maxTimePerMeal: 30,
  objective: "normal",
  dietaryConstraints: [],
  allergens: [],
  cookingLevel: "intermédiaire",
  equipment: [],
};

export function SetupForm() {
  const router = useRouter();
  const [prefs, setPrefsState] = useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load saved preferences
  useEffect(() => {
    const saved = getPreferences();
    if (saved) setPrefsState(saved);
  }, []);

  function toggleArrayItem(arr: string[], item: string): string[] {
    return arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    // Save preferences for next time
    setPreferences(prefs);

    try {
      const pastTitles = getPastTitles();

      const res = await fetch("/api/generate-batch", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ preferences: prefs, pastTitles }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Erreur lors de la génération.");
      }

      if (data.allergenWarnings && data.allergenWarnings.length > 0) {
        setError(
          "Attention allergènes détectés :\n" +
          data.allergenWarnings.join("\n") +
          "\n\nVérifiez les recettes attentivement."
        );
      }

      const batch: Batch = {
        id: crypto.randomUUID(),
        recipes: data.recipes,
        preferences: prefs,
        createdAt: new Date().toISOString(),
        validated: false,
      };

      setCurrentBatch(batch);
      router.push("/batch");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Une erreur est survenue. Réessayez."
      );
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <Loader text="Génération de vos recettes en cours... Cela peut prendre quelques secondes." />
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {error && (
        <div className="rounded-3xl bg-red-50 border border-red-200 p-4 text-sm text-red-700 whitespace-pre-line font-sans">
          {error}
        </div>
      )}

      {/* Nombre de repas */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Nombre de repas
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPrefsState({ ...prefs, numberOfMeals: n })}
              className={`size-10 rounded-full font-semibold text-sm font-sans transition-all duration-200 ${prefs.numberOfMeals === n
                  ? "bg-primary-500 text-white shadow-card"
                  : "bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Nombre de personnes */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Nombre de personnes
        </label>
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => setPrefsState({ ...prefs, numberOfPersons: n })}
              className={`size-10 rounded-full font-semibold text-sm font-sans transition-all duration-200 ${prefs.numberOfPersons === n
                  ? "bg-primary-500 text-white shadow-card"
                  : "bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white"
                }`}
            >
              {n}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Temps max par repas */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Temps max par recette
        </label>
        <div className="flex gap-2">
          {[15, 30, 45, 60].map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setPrefsState({ ...prefs, maxTimePerMeal: t })}
              className={`rounded-full px-4 py-2 font-semibold text-sm font-sans transition-all duration-200 ${prefs.maxTimePerMeal === t
                  ? "bg-primary-500 text-white shadow-card"
                  : "bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white"
                }`}
            >
              {t} min
            </button>
          ))}
        </div>
      </fieldset>

      {/* Objectif */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Objectif
        </label>
        <div className="flex gap-2">
          {(["normal", "sportif"] as const).map((obj) => (
            <button
              key={obj}
              type="button"
              onClick={() => setPrefsState({ ...prefs, objective: obj })}
              className={`rounded-full px-4 py-2 font-semibold text-sm font-sans transition-all duration-200 capitalize ${prefs.objective === obj
                  ? "bg-primary-500 text-white shadow-card"
                  : "bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white"
                }`}
            >
              {obj === "normal" ? "Équilibré" : "Sportif (protéiné)"}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Niveau cuisine */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Niveau cuisine
        </label>
        <div className="flex gap-2">
          {(["débutant", "intermédiaire", "confirmé"] as const).map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => setPrefsState({ ...prefs, cookingLevel: lvl })}
              className={`rounded-full px-3 py-2 font-semibold text-sm font-sans transition-all duration-200 capitalize ${prefs.cookingLevel === lvl
                  ? "bg-primary-500 text-white shadow-card"
                  : "bg-primary-100 text-primary-500 hover:bg-primary-500 hover:text-white"
                }`}
            >
              {lvl}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Inspiration cuisine */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Inspiration cuisine{" "}
          <span className="font-normal text-primary-300">(optionnel)</span>
        </label>
        <p className="text-xs text-primary-300 font-sans -mt-1">
          Laissez vide pour des recettes classiques
        </p>
        <div className="flex flex-wrap gap-2">
          {CUISINE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                setPrefsState({
                  ...prefs,
                  cuisine: prefs.cuisine === opt ? undefined : opt,
                })
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium font-sans transition-all duration-200 ${
                prefs.cuisine === opt
                  ? "bg-accent-orange text-white"
                  : "bg-primary-100 text-primary-500 hover:bg-accent-orange hover:text-white"
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Contraintes alimentaires */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Contraintes alimentaires
        </label>
        <div className="flex flex-wrap gap-2">
          {DIETARY_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                setPrefsState({
                  ...prefs,
                  dietaryConstraints: toggleArrayItem(prefs.dietaryConstraints, opt),
                })
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium font-sans transition-all duration-200 ${prefs.dietaryConstraints.includes(opt)
                  ? "bg-season-500 text-white"
                  : "bg-primary-100 text-primary-500 hover:bg-season-500 hover:text-white"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Allergènes */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Allergènes
        </label>
        <div className="flex flex-wrap gap-2">
          {ALLERGEN_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                setPrefsState({
                  ...prefs,
                  allergens: toggleArrayItem(prefs.allergens, opt),
                })
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium font-sans transition-all duration-200 ${prefs.allergens.includes(opt)
                  ? "bg-red-400 text-white"
                  : "bg-primary-100 text-primary-500 hover:bg-red-400 hover:text-white"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Équipements */}
      <fieldset className="space-y-3">
        <label className="block text-sm font-semibold text-primary-500 font-sans">
          Équipements disponibles
        </label>
        <div className="flex flex-wrap gap-2">
          {EQUIPMENT_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              onClick={() =>
                setPrefsState({
                  ...prefs,
                  equipment: toggleArrayItem(prefs.equipment || [], opt),
                })
              }
              className={`rounded-full px-3 py-1.5 text-sm font-medium font-sans transition-all duration-200 ${prefs.equipment?.includes(opt)
                  ? "bg-accent-orange text-white"
                  : "bg-primary-100 text-primary-500 hover:bg-accent-orange hover:text-white"
                }`}
            >
              {opt}
            </button>
          ))}
        </div>
      </fieldset>

      {/* Submit */}
      <Button type="submit" size="lg" className="w-full">
        Générer mes repas
      </Button>
    </form>
  );
}
