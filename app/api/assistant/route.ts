import { NextRequest, NextResponse } from "next/server";
import Anthropic from "@anthropic-ai/sdk";
import type { Recipe } from "@/lib/types";

const SYSTEM_PROMPT = `Tu es un assistant cuisine concis et pratique. On te fournit le contexte d'une recette (titre, ingrédients, étapes).
Tu réponds en 1-3 phrases maximum.
Tu aides pour : substitution d'ingrédient, adaptation de cuisson, ajustement des portions, dépannage.
Réponds en français, de manière chaleureuse et directe.`;

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "Clé API non configurée." },
      { status: 500 }
    );
  }

  let body: { question: string; recipe: Recipe };
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Requête invalide." },
      { status: 400 }
    );
  }

  const { question, recipe } = body;

  if (!question?.trim() || !recipe) {
    return NextResponse.json(
      { error: "Question et recette requises." },
      { status: 400 }
    );
  }

  const recipeContext = `Recette : ${recipe.title}
Ingrédients : ${recipe.ingredients.map((i) => `${i.name} (${i.quantity} ${i.unit})`).join(", ")}
Étapes : ${recipe.steps.join(" | ")}
Portions : ${recipe.servings} personnes`;

  const client = new Anthropic({ apiKey });

  try {
    const message = await client.messages.create({
      model: "claude-haiku-4-5-20251001",
      max_tokens: 300,
      system: SYSTEM_PROMPT,
      messages: [
        {
          role: "user",
          content: `Contexte recette :\n${recipeContext}\n\nQuestion : ${question.trim()}`,
        },
      ],
    });

    const textBlock = message.content.find((b) => b.type === "text");
    const answer = textBlock && textBlock.type === "text" ? textBlock.text : "Désolé, je n'ai pas pu répondre.";

    return NextResponse.json({ answer }, { status: 200 });
  } catch (error) {
    if (error instanceof Anthropic.APIError && error.status === 429) {
      return NextResponse.json(
        { error: "Trop de requêtes. Patientez quelques secondes." },
        { status: 429 }
      );
    }
    return NextResponse.json(
      { error: "Erreur lors de la réponse." },
      { status: 500 }
    );
  }
}
