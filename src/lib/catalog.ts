export type ProductVariant = {
  id: string
  label: string
  image: string
  alt: string
  swatch: string
}

export type Product = {
  id: string
  type: "Robe" | "Ensemble" | "Tunique"
  name: string
  price: number
  image: string
  alt: string
  badge?: string
  tone: string
  colors: string[]
  variants?: ProductVariant[]
}

export const PRODUCTS: Product[] = [
  {
    id: "robe-eventail",
    type: "Robe",
    name: "Robe Éventail",
    price: 189,
    image: "/produits/robe-eventail.jpg",
    alt: "Robe jaune et blanc portée avec un éventail fleuri",
    badge: "Nouveau",
    tone: "#B54E30",
    colors: ["#DDC6AA", "#B54E30", "#5A5C3B"],
  },
  {
    id: "robe-nuit",
    type: "Robe",
    name: "Robe Nuit",
    price: 249,
    image: "/produits/robe-bleue.jpg",
    alt: "Robe bleue brodée de motifs argentés",
    badge: "Best-seller",
    tone: "#0F3340",
    colors: ["#0F3340", "#B69475"],
  },
  {
    id: "duo-ceremonie",
    type: "Ensemble",
    name: "Duo Cérémonie",
    price: 320,
    image: "/produits/duo-ceremonie.jpg",
    alt: "Tunique verte et robe rouge de cérémonie",
    tone: "#8A2F1D",
    colors: ["#8A2F1D", "#606D18"],
  },
  {
    id: "kanzu-or",
    type: "Tunique",
    name: "Kanzu Or",
    price: 219,
    image: "/produits/kanzu-or.jpg",
    alt: "Tunique blanche aux broderies dorées, vue en pied",
    tone: "#B69475",
    colors: ["#DDC6AA", "#B69475"],
  },
  {
    id: "kanzu-portrait",
    type: "Tunique",
    name: "Kanzu Or, portrait",
    price: 219,
    image: "/produits/kanzu-or-portrait.jpg",
    alt: "Portrait de la tunique blanche brodée d'or",
    badge: "Nouveau",
    tone: "#B69475",
    colors: ["#DDC6AA", "#B69475"],
    variants: [
      {
        id: "blanc-or",
        label: "Blanc / Or",
        image: "/produits/kanzu-or-portrait.jpg",
        alt: "Portrait de la tunique blanche brodée d'or",
        swatch: "#DDC6AA",
      },
      {
        id: "rouge",
        label: "Rouge",
        image: "/produits/kanzu-rouge.jpg",
        alt: "Portrait de la tunique rouge",
        swatch: "#8A2F1D",
      },
    ],
  },
  {
    id: "salouva-azur",
    type: "Robe",
    name: "Salouva Azur",
    price: 179,
    image: "/produits/salouva-azur.jpg",
    alt: "Salouva bleu, or et crème",
    tone: "#0F3340",
    colors: ["#0F3340", "#B69475", "#DDC6AA"],
  },
  {
    id: "robe-terracotta",
    type: "Robe",
    name: "Robe Terracotta",
    price: 169,
    image: "/produits/robe-terracotta.jpg",
    alt: "Robe terracotta et vert portée avec un voile",
    badge: "Édition limitée",
    tone: "#B54E30",
    colors: ["#B54E30", "#606D18"],
  },
  {
    id: "ensemble-ardoise",
    type: "Ensemble",
    name: "Ensemble Ardoise",
    price: 229,
    image: "/produits/ensemble-ardoise.jpg",
    alt: "Silhouette gris-bleu photographiée en pied",
    badge: "Nouveau",
    tone: "#7F8188",
    colors: ["#9EA9BD", "#4B494B", "#BFC1C9"],
  },
  {
    id: "robe-violette",
    type: "Robe",
    name: "Robe Violette",
    price: 239,
    image: "/produits/robe-violette.jpg",
    alt: "Silhouette violette photographiée en pied",
    badge: "Édition limitée",
    tone: "#6B4E5D",
    colors: ["#6B4E5D", "#331B4B", "#BDB9B3"],
  },
]

export const CATEGORIES = [
  {
    name: "Femme",
    count: "5 pièces",
    image: "/produits/salouva-azur.jpg",
    alt: "Salouva bleu et or",
    filter: "Femme",
  },
  {
    name: "Homme",
    count: "2 pièces",
    image: "/produits/kanzu-or.jpg",
    alt: "Tunique blanche aux broderies dorées",
    filter: "Homme",
  },
  {
    name: "Cérémonie",
    count: "2 pièces",
    image: "/produits/duo-ceremonie.jpg",
    alt: "Tenues de cérémonie rouge et verte",
    filter: "Cérémonie",
  },
  {
    name: "Broderies",
    count: "5 pièces",
    image: "/produits/robe-bleue.jpg",
    alt: "Robe bleue brodée",
    filter: "Broderies",
  },
] as const

export const FILTERS = ["Tout", "Robe", "Tunique", "Ensemble"] as const
export type Filter = (typeof FILTERS)[number]

export const JOURNAL = [
  {
    title: "Le lin, fibre vivante",
    excerpt: "Pourquoi nous revenons toujours à cette étoffe au fil des saisons.",
    image: "/produits/robe-terracotta.jpg",
    meta: "Matières · 6 min",
  },
  {
    title: "Les gestes de l'atelier",
    excerpt: "Une journée auprès des artisans qui brodent nos pièces.",
    image: "/produits/kanzu-or-portrait.jpg",
    meta: "Savoir-faire · 4 min",
  },
  {
    title: "Entretenir ses broderies",
    excerpt: "Quelques réflexes simples pour faire durer l'éclat du fil d'or.",
    image: "/produits/salouva-azur.jpg",
    meta: "Conseils · 3 min",
  },
]

export const PALETTE = [
  "#0F3340", "#424124", "#5A5C3B", "#606D18", "#B54E30",
  "#8A2F1D", "#DDC6AA", "#B69475", "#7D795B", "#571B0E",
]

export const formatPrice = (value: number) =>
  new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(value)
