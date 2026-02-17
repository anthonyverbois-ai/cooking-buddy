"use client";

import type { Recipe } from "@/lib/types";

interface ExportMarkdownProps {
  recipes: Recipe[];
}

function recipesToMarkdown(recipes: Recipe[]): string {
  const lines: string[] = [];
  lines.push("# Mon batch de recettes\n");
  lines.push(`> ${recipes.length} recettes — Généré le ${new Date().toLocaleDateString("fr-FR")}\n`);

  for (const recipe of recipes) {
    lines.push(`## ${recipe.title}\n`);
    lines.push(`*${recipe.description}*\n`);
    lines.push(`- Préparation : ${recipe.prepTime} min`);
    lines.push(`- Cuisson : ${recipe.cookTime} min`);
    lines.push(`- Total : ${recipe.totalTime} min`);
    lines.push(`- Portions : ${recipe.servings} personnes`);
    lines.push(`- Difficulté : ${recipe.difficulty}\n`);

    lines.push("### Ingrédients\n");
    for (const ing of recipe.ingredients) {
      lines.push(`- ${ing.name} : ${ing.quantity} ${ing.unit}`);
    }

    lines.push("\n### Préparation\n");
    recipe.steps.forEach((step, i) => {
      lines.push(`${i + 1}. ${step}`);
    });

    lines.push("\n---\n");
  }

  return lines.join("\n");
}

export function ExportMarkdown({ recipes }: ExportMarkdownProps) {
  function handleExport() {
    const markdown = recipesToMarkdown(recipes);
    const blob = new Blob([markdown], { type: "text/markdown;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `batch-recettes-${new Date().toISOString().slice(0, 10)}.md`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  return (
    <button
      onClick={handleExport}
      className="flex items-center gap-1.5 px-3 py-1.5 text-sm font-medium font-sans text-primary-500 hover:text-accent-orange hover:bg-primary-100 rounded-full transition-all duration-200"
    >
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round" className="size-4">
        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
        <polyline points="7 10 12 15 17 10" />
        <line x1="12" y1="15" x2="12" y2="3" />
      </svg>
      Exporter .md
    </button>
  );
}
