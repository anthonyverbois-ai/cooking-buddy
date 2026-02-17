export const seasonalIngredients: Record<number, string[]> = {
  1: [
    "poireau", "chou", "endive", "mâche", "navet", "céleri", "pomme", "poire",
    "clémentine", "orange", "carotte", "betterave", "topinambour", "panais",
    "courge", "épinard", "oignon", "ail", "échalote",
  ],
  2: [
    "poireau", "chou", "endive", "mâche", "navet", "topinambour", "pomme",
    "poire", "citron", "carotte", "betterave", "panais", "céleri-rave",
    "radis noir", "épinard", "oignon", "ail", "échalote",
  ],
  3: [
    "poireau", "épinard", "chou-fleur", "radis", "carotte", "navet", "pomme",
    "poire", "citron", "cresson", "oseille", "oignon", "ail", "échalote",
  ],
  4: [
    "asperge", "radis", "épinard", "petit pois", "artichaut", "carotte nouvelle",
    "navet nouveau", "cresson", "rhubarbe", "fraise", "oignon nouveau", "ail",
  ],
  5: [
    "asperge", "petit pois", "fève", "artichaut", "radis", "laitue", "fraise",
    "cerise", "rhubarbe", "concombre", "oignon nouveau", "ail",
  ],
  6: [
    "courgette", "aubergine", "tomate", "poivron", "haricot vert", "petit pois",
    "fraise", "cerise", "abricot", "melon", "pêche", "concombre", "oignon",
  ],
  7: [
    "tomate", "courgette", "aubergine", "poivron", "haricot vert", "concombre",
    "melon", "pêche", "abricot", "nectarine", "framboise", "myrtille", "figue",
    "oignon", "ail",
  ],
  8: [
    "tomate", "courgette", "aubergine", "poivron", "maïs", "haricot vert",
    "melon", "pêche", "prune", "mirabelle", "raisin", "figue", "mûre",
    "oignon", "ail",
  ],
  9: [
    "tomate", "courgette", "aubergine", "poivron", "courge", "champignon",
    "raisin", "figue", "prune", "pomme", "poire", "noix", "oignon", "ail",
  ],
  10: [
    "courge", "potiron", "champignon", "poireau", "céleri", "chou", "brocoli",
    "épinard", "châtaigne", "pomme", "poire", "coing", "noix", "raisin",
    "oignon", "ail", "échalote",
  ],
  11: [
    "courge", "potiron", "poireau", "chou", "endive", "céleri", "navet",
    "betterave", "pomme", "poire", "clémentine", "kiwi", "châtaigne",
    "oignon", "ail", "échalote",
  ],
  12: [
    "poireau", "chou", "endive", "mâche", "navet", "céleri", "topinambour",
    "pomme", "poire", "clémentine", "orange", "kiwi", "châtaigne", "panais",
    "oignon", "ail", "échalote",
  ],
};

export function getCurrentSeasonIngredients(): string[] {
  const month = new Date().getMonth() + 1;
  return seasonalIngredients[month] ?? [];
}
