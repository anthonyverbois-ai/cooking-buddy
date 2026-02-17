export type FunContentType = "joke" | "quote" | "fact" | "challenge";

export interface FunContent {
  type: FunContentType;
  text: string;
  author?: string; // For quotes
}

const FUN_CONTENT: FunContent[] = [
  // --- Jokes (dad jokes culinaires) ---
  { type: "joke", text: "Pourquoi les plats ne vont jamais en prison ? Parce qu'ils passent toujours au four." },
  { type: "joke", text: "Qu'est-ce qu'un canard qui est toujours à l'heure ? Un canard à l'orange pressée." },
  { type: "joke", text: "Comment appelle-t-on un chat tombé dans un pot de peinture le jour de Noël ? Un chat-peint de Noël." },
  { type: "joke", text: "Quelle est la femme la plus proche de l'homme ? La crêpe, car elle lui saute dessus." },
  { type: "joke", text: "Pourquoi les cuisiniers sont-ils cruels ? Parce qu'ils battent les œufs et fouettent la crème." },
  { type: "joke", text: "Quel est le comble pour un boulanger ? Raconter des salades." },
  { type: "joke", text: "Comment s'appelle le meilleur espion au monde ? Pâte à tartiner, il s'infiltre partout." },
  { type: "joke", text: "Pourquoi le fromage ne peut pas courir le marathon ? Parce qu'il est toujours à bout de souffle… de chèvre." },
  { type: "joke", text: "Qu'est-ce qu'une fraise sur un cheval ? Un fruit au galop." },
  { type: "joke", text: "Quel légume est le plus rock'n'roll ? Le navet, parce qu'il est toujours dans les bides." },
  { type: "joke", text: "Pourquoi les carottes n'aiment pas les films d'horreur ? Parce qu'elles ont les yeux râpés." },
  { type: "joke", text: "Qu'est-ce qu'un croissant avec un pistolet ? Un pain au chocolat-braquage." },

  // --- Quotes ---
  { type: "quote", text: "La cuisine, c'est quand les choses ont le goût de ce qu'elles sont.", author: "Curnonsky" },
  { type: "quote", text: "En cuisine, il faut garder son sang-froid tout en donnant de la chaleur.", author: "Pierre Gagnaire" },
  { type: "quote", text: "La cuisine est l'art de transformer instantanément en joie des produits chargés d'histoire.", author: "Guy Savoy" },
  { type: "quote", text: "Un repas sans fromage est une belle à qui il manque un œil.", author: "Brillat-Savarin" },
  { type: "quote", text: "La bonne cuisine est la base du véritable bonheur.", author: "Auguste Escoffier" },
  { type: "quote", text: "La cuisine, c'est l'envers du décor, là où se mijote le bonheur.", author: "Paul Bocuse" },
  { type: "quote", text: "Cuisiner suppose une tête légère, un esprit généreux et un cœur large.", author: "Paul Gauguin" },
  { type: "quote", text: "Il n'y a pas de bonne cuisine si au départ elle n'est pas faite par amitié pour celui ou celle à qui elle est destinée.", author: "Paul Bocuse" },
  { type: "quote", text: "La découverte d'un mets nouveau fait plus pour le bonheur du genre humain que la découverte d'une étoile.", author: "Brillat-Savarin" },
  { type: "quote", text: "On ne fait pas de grande cuisine sans grande sauce.", author: "Joël Robuchon" },
  { type: "quote", text: "Cuisiner, c'est pas compliqué. Il faut de bons produits, un peu de technique et beaucoup d'amour.", author: "Joël Robuchon" },
  { type: "quote", text: "Le secret d'un bon repas, c'est de cuisiner avec le cœur.", author: "Alain Ducasse" },

  // --- Facts ---
  { type: "fact", text: "La France compte plus de 400 variétés de fromages. Le général de Gaulle disait : « Comment voulez-vous gouverner un pays qui a 246 variétés de fromage ? »" },
  { type: "fact", text: "Le croissant n'est pas français ! Il est d'origine autrichienne (le kipferl) et a été popularisé à Paris au XIXe siècle." },
  { type: "fact", text: "Les carottes étaient violettes avant le XVIIe siècle. La variété orange a été développée aux Pays-Bas en hommage à la maison d'Orange-Nassau." },
  { type: "fact", text: "Le chocolat était utilisé comme monnaie par les Aztèques. Un lapin valait environ 10 fèves de cacao." },
  { type: "fact", text: "La tomate a été considérée comme toxique en Europe pendant près de 200 ans. On l'appelait « pomme d'amour » mais on n'osait pas la manger." },
  { type: "fact", text: "Le miel est le seul aliment qui ne se périme jamais. On a retrouvé du miel comestible dans des tombes égyptiennes vieilles de 3 000 ans." },
  { type: "fact", text: "La vanille est la deuxième épice la plus chère au monde après le safran. Une gousse de vanille met 9 mois à mûrir." },
  { type: "fact", text: "Le batch cooking est né au Japon ! Le concept de préparer les repas de la semaine le dimanche s'appelle « tsukurioki » (作り置き)." },
  { type: "fact", text: "Les pâtes existent depuis plus de 4 000 ans. On a retrouvé un bol de nouilles en Chine datant de 2000 av. J.-C." },
  { type: "fact", text: "Le poivron vert, jaune et rouge sont le même légume à des stades de maturité différents. Le vert est le moins mûr, le rouge le plus sucré." },
  { type: "fact", text: "La banane est techniquement une baie, mais la fraise n'en est pas une. La botanique est pleine de surprises." },
  { type: "fact", text: "Les oignons nous font pleurer à cause du sulfoxyde de thiopropanal, un gaz libéré quand on coupe les cellules. Astuce : coupez-les sous un filet d'eau !" },

  // --- Challenges ---
  { type: "challenge", text: "Défi du jour : cuisinez un repas complet en utilisant seulement 5 ingrédients (sel, poivre et huile ne comptent pas)." },
  { type: "challenge", text: "Défi du jour : préparez le dîner de ce soir sans consulter de recette. Faites confiance à votre instinct !" },
  { type: "challenge", text: "Défi du jour : faites goûter un nouveau légume à vos enfants. Bonus si c'est un légume de saison !" },
  { type: "challenge", text: "Défi du jour : cuisinez un plat d'un autre pays ce soir. L'Italie, le Maroc, le Japon… à vous de choisir !" },
  { type: "challenge", text: "Défi du jour : transformez vos restes en un nouveau plat. Frittata, gratin, wrap… soyez créatif !" },
  { type: "challenge", text: "Défi du jour : préparez un dessert maison avec seulement 3 ingrédients. C'est possible, promis !" },
  { type: "challenge", text: "Défi du jour : cuisinez avec votre enfant. Même les plus petits peuvent laver les légumes ou mélanger !" },
  { type: "challenge", text: "Défi du jour : essayez une épice que vous n'utilisez jamais. Cumin, paprika fumé, curcuma… osez !" },
  { type: "challenge", text: "Défi du jour : préparez votre prochain batch en musique. Une bonne playlist et la cuisine devient une fête !" },
  { type: "challenge", text: "Défi du jour : remplacez un ingrédient habituel par sa version de saison. Courge au lieu de courgette, mâche au lieu de laitue…" },
  { type: "challenge", text: "Défi du jour : prenez en photo votre plat avant de le manger. Vous serez fier du résultat !" },
  { type: "challenge", text: "Défi du jour : cuisinez un plat que vous mangiez enfant. La madeleine de Proust, version cuisine !" },
];

export function getRandomFunContent(exclude?: FunContent): FunContent {
  const pool = exclude
    ? FUN_CONTENT.filter((item) => item.text !== exclude.text)
    : FUN_CONTENT;
  return pool[Math.floor(Math.random() * pool.length)];
}
