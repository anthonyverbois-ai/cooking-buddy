import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import { buildBatchPrompt, getCurrentMonthName } from "@/lib/prompts";
import { parseAndValidateRecipes, checkAllergens } from "@/lib/schemas";
import { getCurrentSeasonIngredients } from "@/lib/seasons";
import type { UserPreferences } from "@/lib/types";

const MAX_RETRIES = 2;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Clé API Anthropic non configurée." },
      { status: 500 }
    );
  }

  let body: { preferences: UserPreferences; pastTitles: string[] };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  const { preferences, pastTitles = [] } = body;

  if (!preferences || !preferences.numberOfMeals) {
    return NextResponse.json(
      { error: "Préférences manquantes." },
      { status: 400 }
    );
  }

  const seasonIngredients = getCurrentSeasonIngredients();
  const currentMonth = getCurrentMonthName();
  const systemPrompt = buildBatchPrompt(
    preferences,
    seasonIngredients,
    pastTitles,
    currentMonth
  );

  const client = new Anthropic({ apiKey });

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= MAX_RETRIES; attempt++) {
    try {
      const message = await client.messages.create({
        model: "claude-haiku-4-5-20251001",
        max_tokens: 4096,
        messages: [
          {
            role: "user",
            content: `Génère ${preferences.numberOfMeals} recettes pour ${preferences.numberOfPersons} personnes. JSON uniquement.`,
          },
        ],
        system: systemPrompt,
      });

      const textBlock = message.content.find((b) => b.type === "text");
      if (!textBlock || textBlock.type !== "text") {
        throw new Error("Pas de contenu texte dans la réponse.");
      }

      const recipes = parseAndValidateRecipes(textBlock.text);

      // Allergen safety check
      const allergenCheck = checkAllergens(recipes, preferences.allergens);
      if (!allergenCheck.safe) {
        return NextResponse.json(
          {
            recipes,
            allergenWarnings: allergenCheck.warnings,
          },
          { status: 200 }
        );
      }

      return NextResponse.json({ recipes }, { status: 200 });
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (
        error instanceof Anthropic.APIError &&
        error.status === 429
      ) {
        return NextResponse.json(
          { error: "Trop de requêtes. Patientez quelques secondes et réessayez." },
          { status: 429 }
        );
      }

      if (attempt < MAX_RETRIES) {
        continue;
      }
    }
  }

  return NextResponse.json(
    {
      error:
        "Impossible de générer les recettes après plusieurs tentatives. " +
        (lastError?.message || "Erreur inconnue."),
    },
    { status: 500 }
  );
}
