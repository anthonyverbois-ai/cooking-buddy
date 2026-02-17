# CLAUDE.md — SoloDad Cooking v1

## Projet

SoloDad Cooking est une application web mobile-first qui aide les parents pressés à générer un batch de repas maison, obtenir une liste de courses prête à l'emploi, et consulter les recettes le jour J avec un assistant contextuel.

## Stack technique

- **Framework** : Next.js 14+ (App Router)
- **Styling** : Tailwind CSS
- **Stockage local** : localStorage (données utilisateur, favoris, historique)
- **LLM** : API Anthropic Claude Haiku (claude-haiku-4-5-20251001)
- **Backend** : Vercel Serverless Functions (proxy API LLM uniquement)
- **Déploiement** : Vercel
- **Langue UI** : Français

## Architecture

```
/app
  /page.tsx                  → Page d'accueil / setup du batch
  /batch/page.tsx            → Affichage des recettes générées (cards)
  /batch/[id]/page.tsx       → Détail recette + mode cuisine + assistant Q&A
  /courses/page.tsx          → Liste de courses unifiée
  /favoris/page.tsx          → Recettes favorites
  /historique/page.tsx       → Historique des recettes cuisinées
/api
  /generate-batch/route.ts   → Serverless: génération batch (proxy Anthropic)
  /replace-recipe/route.ts   → Serverless: remplacement d'une recette
  /assistant/route.ts        → Serverless: Q&A contextuel (1 question → 1 réponse)
/lib
  /prompts.ts                → Tous les prompts système + templates
  /schemas.ts                → Schémas JSON des recettes (validation)
  /seasons.ts                → Table de saisonnalité France (mois → ingrédients)
  /storage.ts                → Helpers localStorage (get/set/reset)
  /ingredients.ts            → Normalisation unités + regroupement catégories
  /types.ts                  → Types TypeScript partagés
/components
  /SetupForm.tsx             → Formulaire de configuration du batch
  /RecipeCard.tsx            → Card recette (résumé)
  /RecipeDetail.tsx          → Vue détail recette + mode cuisine
  /ShoppingList.tsx          → Liste de courses avec checklist
  /AssistantChat.tsx         → Interface Q&A (1 question → 1 réponse)
  /ExportMarkdown.tsx        → Bouton export Markdown
  /ui/                       → Composants réutilisables (Button, Loader, Badge, etc.)
```

## Modèle de données (localStorage)

```typescript
// Types principaux

interface UserPreferences {
  numberOfMeals: number;           // 1-7
  numberOfPersons: number;         // 1-8
  maxTimePerMeal: number;          // en minutes (15, 30, 45, 60)
  objective: "normal" | "sportif"; // Sportif = protéines renforcées
  dietaryConstraints: string[];    // ex: ["végétarien", "sans gluten"]
  allergens: string[];             // ex: ["arachides", "lactose"]
  cookingLevel?: "débutant" | "intermédiaire" | "confirmé";
  equipment?: string[];            // ex: ["four", "mixeur", "cocotte"]
}

interface Recipe {
  id: string;                      // uuid
  title: string;
  description: string;             // 1-2 phrases
  prepTime: number;                // minutes
  cookTime: number;                // minutes
  totalTime: number;               // prepTime + cookTime
  servings: number;
  difficulty: "facile" | "moyen";
  objective: "normal" | "sportif";
  proteinSource?: string;          // obligatoire si sportif
  season: string;                  // mois de génération
  ingredients: Ingredient[];
  steps: string[];                 // étapes numérotées
  tags: string[];                  // ex: ["rapide", "batch-friendly", "protéiné"]
  generatedAt: string;             // ISO date
}

interface Ingredient {
  name: string;
  quantity: number;
  unit: "g" | "kg" | "ml" | "L" | "cl" | "pièce(s)" | "c. à soupe" | "c. à café" | "pincée";
  category: "légumes" | "fruits" | "viandes" | "poissons" | "produits laitiers" | "épicerie" | "surgelés" | "condiments" | "autres";
}

interface Batch {
  id: string;
  recipes: Recipe[];
  preferences: UserPreferences;
  createdAt: string;
  validated: boolean;
}

interface RecipeHistory {
  recipeId: string;
  recipeTitle: string;
  timesCooked: number;
  lastCookedAt: string;            // ISO date
  isFavorite: boolean;
  rating?: number;                 // 1-5 (v1 should-have, peut être omis au MVP)
}

// Clés localStorage
// "solodad_preferences"  → UserPreferences
// "solodad_current_batch" → Batch
// "solodad_history"      → RecipeHistory[]
// "solodad_favorites"    → string[] (recipe IDs)
// "solodad_past_titles"  → string[] (titres déjà générés, pour anti-duplication)
```

## Saisonnalité France (fichier /lib/seasons.ts)

Table hardcodée : pour chaque mois (1-12), une liste d'ingrédients de saison en France. Cette table est injectée dans le prompt de génération pour guider le LLM. Exemple de structure :

```typescript
export const seasonalIngredients: Record<number, string[]> = {
  1: ["poireau", "chou", "endive", "mâche", "navet", "céleri", "pomme", "poire", "clémentine", "orange"],
  2: ["poireau", "chou", "endive", "mâche", "navet", "topinambour", "pomme", "poire", "citron"],
  // ... tous les mois
  6: ["courgette", "aubergine", "tomate", "poivron", "haricot vert", "petit pois", "fraise", "cerise", "abricot"],
  // ...
};
```

## Prompts IA

### Prompt de génération de batch

Le prompt système doit :
1. Recevoir les préférences utilisateur (nombre de repas, personnes, temps max, objectif, contraintes, allergènes, niveau, équipements).
2. Recevoir le mois courant + la liste d'ingrédients de saison correspondante.
3. Recevoir la liste des titres de recettes déjà générées (anti-duplication).
4. Demander une réponse **exclusivement en JSON** respectant le schéma `Recipe[]`.
5. Imposer les règles suivantes :
   - JAMAIS d'ingrédient contenant un allergène listé.
   - `totalTime <= maxTimePerMeal` pour chaque recette.
   - Si objectif = "sportif", chaque recette DOIT avoir une source de protéines identifiée.
   - Favoriser les ingrédients de saison (au moins 2 par recette).
   - Étapes simples et explicites, adaptées au niveau cuisine.
   - Ingrédients avec quantités précises et unités normalisées.
   - Éviter les recettes dont le titre est dans la liste "déjà faites".
6. Utiliser le mode **structured output / JSON** de l'API Anthropic (pas de markdown dans la réponse).

### Prompt de remplacement d'une recette

Même contexte que le batch, mais :
- Générer 1 seule recette.
- Exclure les titres du batch courant + historique.

### Prompt assistant Q&A (Jour J)

Prompt système :
- Tu es un assistant cuisine concis et pratique.
- Contexte : la recette complète (JSON) est fournie.
- Tu réponds en 1-3 phrases max.
- Cas d'usage : substitution d'ingrédient, adaptation cuisson, scaling portions, dépannage.
- Format : 1 question utilisateur → 1 réponse. Pas de multi-turn.

## Fonctionnalités — Priorités (MoSCoW)

### MUST (MVP)

1. **Setup form** : formulaire de configuration (nombre repas, personnes, temps max, objectif, contraintes, allergènes). Sauvegarde des préférences en localStorage pour pré-remplir au prochain usage.
2. **Génération batch** : appel API → affichage de X recettes en cards. Loader pendant la génération. Gestion d'erreur avec retry.
3. **Détail recette** : vue complète (ingrédients, étapes, temps, tags).
4. **Remplacement recette** : bouton "Remplacer" sur chaque card → régénère 1 recette en respectant les mêmes contraintes.
5. **Validation batch** : bouton "Valider" → sauvegarde le batch, enregistre les titres dans l'historique anti-duplication.
6. **Liste de courses unifiée** : agrégation de tous les ingrédients du batch validé, normalisés (fusion doublons, conversion unités), regroupés par catégorie. Checklist cochable. Bouton "Copier" (texte brut dans le presse-papier).

### SHOULD

7. **Favoris** : toggle favori sur chaque recette. Page dédiée listant les favoris.
8. **Historique "déjà cuisinée"** : marquer une recette comme cuisinée (incrémente `timesCooked`, met à jour `lastCookedAt`). Badge "déjà faite" sur les cards. Anti-duplication dans la génération.
9. **Export Markdown** : bouton qui génère un fichier .md contenant toutes les recettes du batch (titre, ingrédients, étapes) — téléchargement direct.

### COULD (v1 si temps)

10. **Assistant Q&A Jour J** : champ texte sur la page détail recette → 1 question → 1 réponse contextualisée. Pas de mémoire conversationnelle.
11. **Rating 1-5 étoiles** : notation locale sur chaque recette.

### WON'T (v2+)

- Budget €/repas
- Intégration e-commerce / panier auto
- Calendrier / planning par jour
- Sync multi-device / compte utilisateur
- Export PDF

## Design & UX

### Principes
- **Mobile-first** : toute l'app doit être utilisable confortablement sur un smartphone (courses en magasin, recette en cuisine).
- **Simplicité** : pas de surcharge visuelle. Le parent pressé doit comprendre en 3 secondes ce qu'il peut faire.
- **Ton** : chaleureux, décontracté, encourageant. Pas de jargon culinaire inutile.
- **Couleurs** : palette chaleureuse, appetizing (tons terre, orange doux, vert saison). Éviter le look "app corporate".
- **Typographie** : lisible en cuisine (taille suffisante pour les étapes), contraste élevé.

### Navigation
- Bottom navigation bar (mobile) avec 4 onglets :
  1. **Nouveau batch** (icône : chef hat ou +)
  2. **Mon batch** (icône : liste) — batch courant
  3. **Courses** (icône : panier)
  4. **Favoris** (icône : cœur)
- Accès historique via menu ou depuis favoris.

### Écrans principaux

1. **Setup** : formulaire en étapes ou accordéon. Pré-rempli avec les dernières préférences. Bouton "Générer mes repas" bien visible.
2. **Batch** : grille de cards (2 colonnes mobile). Chaque card : titre, temps total, tags, badge "déjà faite" si applicable. Actions : voir détail, remplacer, favori. Bouton "Valider le batch" en sticky bottom.
3. **Détail recette** : titre, description, temps, portions, ingrédients (liste), étapes (numérotées, grandes), bouton favori, bouton "cuisinée", zone assistant Q&A (could).
4. **Liste de courses** : groupée par catégorie (en-têtes), chaque ingrédient cochable, bouton "Copier la liste" sticky en haut. Compteur d'items restants.
5. **Favoris** : liste de recettes favorites, accès rapide au détail.

## Garde-fous & Fiabilité

### Allergènes (critique)
- La liste d'allergènes est injectée dans le prompt avec instruction STRICTE de ne jamais inclure ces ingrédients.
- Après réception du JSON, **validation côté client** : vérifier qu'aucun ingrédient du batch ne contient un mot-clé allergène. Si détecté → alerte utilisateur + bloquer la validation.
- Maintenir une liste de mots-clés allergènes courants pour cette vérification :
  ```
  arachide, cacahuète, gluten, blé, seigle, orge, avoine, lait, lactose, fromage, crème, beurre,
  œuf, soja, fruits à coque, noix, noisette, amande, cajou, pistache, poisson, crustacé, crevette,
  mollusque, sésame, céleri, moutarde, lupin, sulfites
  ```

### Validation JSON
- Parser la réponse LLM avec try/catch.
- Valider contre le schéma TypeScript (vérifier que chaque recette a tous les champs requis).
- Si le JSON est invalide ou incomplet → retry automatique (max 2 retries) → puis message d'erreur user-friendly.

### Gestion d'erreur
- Timeout API : 60 secondes max par appel, puis message "La génération prend plus de temps que prévu, réessayez."
- Rate limiting : si erreur 429, afficher "Trop de requêtes, patientez quelques secondes."
- Erreur réseau : message clair + bouton retry.

## Variables d'environnement

```
ANTHROPIC_API_KEY=sk-ant-...   # Clé API Anthropic (côté serveur uniquement, JAMAIS exposée au client)
```

## Commandes

```bash
npm run dev       # Développement local
npm run build     # Build production
npm run start     # Serveur production local
```

## Contraintes de développement

- Tout le code en **TypeScript** strict.
- Composants React fonctionnels uniquement (hooks).
- Pas de bibliothèque UI lourde (pas de MUI, pas de Chakra) — Tailwind CSS seul.
- Pas d'authentification, pas de base de données externe.
- Toute donnée utilisateur en localStorage, supprimable via un bouton "Réinitialiser mes données" dans un menu settings.
- L'app doit fonctionner offline pour la consultation des recettes déjà générées (les données sont en localStorage). Seule la génération nécessite une connexion.
- Responsive : mobile-first, mais utilisable sur desktop.
- Français partout (UI, prompts, contenu généré).
