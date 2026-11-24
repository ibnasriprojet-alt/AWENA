# Awena — maquette React (shadcn + Tailwind + TypeScript)

Le composant `PanoramicSpreadHero` est intégré **en hero** de la page. La maquette HTML d'origine est conservée dans `maquette-statique.html` (+ `styles.css`). Le précédent hero (`ClothingRailHero`) et sa démo restent dans le projet, non utilisés.

## Démarrage

```bash
npm install
npm run dev
```

Puis ouvrir l'URL affichée par Vite (par défaut `http://localhost:5173`).

Vérifications :

```bash
npm run typecheck
npm run build
```

## Configuration du projet (déjà en place)

Le dossier n'était pas un projet shadcn/Tailwind/TypeScript. Il a été initialisé avec :

- **Vite + React 19 + TypeScript** (`vite.config.ts`, `tsconfig*.json`, `src/main.tsx`)
- **Tailwind CSS v4** via `@tailwindcss/vite`, importé dans `src/index.css`
- **tw-animate-css** pour les utilitaires `animate-in` / `fade-in` utilisés par le composant
- **structure shadcn** : `components.json`, alias `@/*` → `src/*`, tokens CSS dans `src/index.css`, `src/lib/utils.ts`
- **lucide-react** pour les icônes de l'interface
- **motion** pour le hero panoramique (`motion/react` : `useScroll`, `useTransform`, `useSpring`, `useMotionValueEvent`, `useReducedMotion`)
- **clsx** + **tailwind-merge** pour l'utilitaire `cn`

Si vous repartez de zéro, la commande shadcn équivalente est :

```bash
npx shadcn@latest init
npx shadcn@latest add button
```

Le point important est l'alias `@/components/ui` : le composant est importé via
`@/components/ui/product-rail-gallery`. Sans cet alias (ou sans le dossier
`src/components/ui`), les imports UI de shadcn et du rail ne résolvent pas, et
les futures commandes `npx shadcn@latest add ...` écriraient les composants
ailleurs que là où l'application les cherche.

## Fichiers du composant

| Fichier | Rôle |
| --- | --- |
| `src/components/ui/panoramic-spread-hero.tsx` | Hero fourni, copié à l'identique |
| `src/components/panoramic-demo.tsx` | Démo fournie (simple wrapper) |
| `src/App.tsx` | Hero = `PanoramicSpreadHero` + reste de la page |
| `src/index.css` | Tokens shadcn + palette extraite du JPG |

## Données et comportement du hero

Le composant ne prend **aucune prop** : les 8 images sont définies dans `IMAGES`
et la géométrie des cartes est générée automatiquement (desktop/mobile). Aucun
provider ni store externe n'est nécessaire : il gère lui-même le scroll
(`useScroll`), l'interpolation 3D, le titre, le parallaxe au pointeur et
`prefers-reduced-motion`. Le wrapper `.panoramic-hero` dans `App.tsx` et les
règles à la fin de `src/index.css` réinterprètent ses classes `neutral-*`/`white`
avec la palette du JPG sans modifier le code du composant.

Les couleurs de l'interface (tokens shadcn `background`, `foreground`, `primary`,
`muted`, `border`, `ring`, etc.) utilisent exactement les 10 teintes extraites de
`palette color.jpg` :

`#0F3340` · `#424124` · `#5A5C3B` · `#606D18` · `#B54E30` · `#8A2F1D` ·
`#DDC6AA` · `#B69475` · `#7D795B` · `#571B0E`
