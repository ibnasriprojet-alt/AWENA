import { useCallback, useEffect, useMemo, useState, type ReactNode } from "react"
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  Check,
  Instagram,
  Lock,
} from "lucide-react"

import CartDrawer, { type CartLine } from "@/components/cart-drawer"
import ProductCard from "@/components/product-card"
import Reveal from "@/components/reveal"
import SearchOverlay from "@/components/search-overlay"
import SiteHeader from "@/components/site-header"
import PanoramicSpreadHero from "@/components/ui/panoramic-spread-hero"
import {
  CATEGORIES,
  FILTERS,
  MEN_PRODUCTS,
  WOMEN_PRODUCTS,
  type Filter,
  type Product,
} from "@/lib/catalog"

const CATEGORY_FILTER: Record<string, Filter> = {
  Femme: "Robe",
  Cérémonie: "Ensemble",
  Broderies: "Robe",
}

function Eyebrow({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <p className={`label mb-4 ${light ? "text-sand" : "text-terra"}`}>
      {children}
    </p>
  )
}

function SectionTitle({ children, light = false }: { children: ReactNode; light?: boolean }) {
  return (
    <h2 className={`font-display text-4xl leading-[1.05] tracking-tight sm:text-5xl ${light ? "text-paper" : ""}`}>
      {children}
    </h2>
  )
}

export default function App() {
  const [cart, setCart] = useState<CartLine[]>([])
  const [cartOpen, setCartOpen] = useState(false)
  const [searchOpen, setSearchOpen] = useState(false)
  const [favorites, setFavorites] = useState<string[]>([])
  const [filter, setFilter] = useState<Filter>("Tout")
  const [toast, setToast] = useState<string | null>(null)
  const [email, setEmail] = useState("")
  const [subscribed, setSubscribed] = useState(false)
  const [showTop, setShowTop] = useState(false)

  const cartCount = cart.reduce((sum, line) => sum + line.qty, 0)
  const visibleProducts = useMemo(
    () => (filter === "Tout" ? WOMEN_PRODUCTS : WOMEN_PRODUCTS.filter((product) => product.type === filter)),
    [filter],
  )

  useEffect(() => {
    if (!toast) return
    const timer = window.setTimeout(() => setToast(null), 3200)
    return () => window.clearTimeout(timer)
  }, [toast])

  useEffect(() => {
    document.body.style.overflow = cartOpen || searchOpen ? "hidden" : ""
    return () => {
      document.body.style.overflow = ""
    }
  }, [cartOpen, searchOpen])

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 1200)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  const addToCart = useCallback((product: Product) => {
    setCart((lines) => {
      const existing = lines.find((line) => line.id === product.id)
      if (existing) {
        return lines.map((line) =>
          line.id === product.id ? { ...line, qty: line.qty + 1 } : line,
        )
      }
      return [...lines, { ...product, qty: 1 }]
    })
    setToast(`${product.name} · ajouté au panier`)
  }, [])

  const changeQty = (id: string, delta: number) => {
    setCart((lines) =>
      lines
        .map((line) => (line.id === id ? { ...line, qty: line.qty + delta } : line))
        .filter((line) => line.qty > 0),
    )
  }

  const toggleFavorite = (id: string) => {
    setFavorites((current) =>
      current.includes(id) ? current.filter((item) => item !== id) : [...current, id],
    )
  }

  const selectCategory = (name: string) => {
    const targetId = name === "Homme" ? "exclusivite-homme" : "essentiels"
    if (name !== "Homme") setFilter(CATEGORY_FILTER[name] ?? "Tout")
    document.getElementById(targetId)?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <div className="min-h-screen overflow-x-clip bg-paper text-teal">
      <SiteHeader
        cartCount={cartCount}
        onOpenCart={() => setCartOpen(true)}
        onOpenSearch={() => setSearchOpen(true)}
      />

      <main>
        {/* HERO — galerie panoramique au défilement */}
        <section id="accueil" aria-label="Collection automne hiver 2026" className="panoramic-hero">
          <PanoramicSpreadHero />
        </section>

        {/* Catégories */}
        <section id="collections" className="relative overflow-hidden bg-cream/30 px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-[1600px]">
            <Reveal className="mb-12 flex flex-wrap items-end justify-between gap-6">
              <div>
                <Eyebrow>01 — Explorer</Eyebrow>
                <SectionTitle>Par envie,<br /><em className="text-terra">par saison.</em></SectionTitle>
              </div>
              <p className="max-w-[280px] text-sm leading-relaxed text-olive">
                Quatre portes d'entrée dans un vestiaire volontairement court.
              </p>
            </Reveal>

            <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
              {CATEGORIES.map((category, index) => (
                <Reveal key={category.name} delay={index * 90} className={index % 2 === 1 ? "lg:mt-12" : ""}>
                  <button
                    type="button"
                    onClick={() => selectCategory(category.name)}
                    className="group relative flex aspect-[3/4] w-full flex-col justify-end overflow-hidden p-5 text-left sm:p-6"
                  >
                    <img
                      src={category.image}
                      alt={category.alt}
                      loading="lazy"
                      className="absolute inset-0 size-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-110"
                    />
                    <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-teal/85 via-teal/25 to-transparent transition-opacity duration-500 group-hover:opacity-90" />
                    <span className={`absolute left-4 top-4 px-2 py-1 text-[8px] font-bold uppercase tracking-[0.16em] sm:left-5 sm:top-5 ${
                      category.name === "Homme" ? "border border-sand/70 text-sand" : "bg-sand text-teal"
                    }`}>
                      {category.tag}
                    </span>
                    <span className="absolute right-5 top-5 grid size-9 translate-y-2 place-items-center rounded-full border border-paper/60 text-paper opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100">
                      <ArrowUpRight className="size-4" strokeWidth={1.4} />
                    </span>
                    <span className="relative z-10 flex items-end justify-between gap-2">
                      <span>
                        <span className="block font-display text-2xl text-paper sm:text-3xl">{category.name}</span>
                        <small className="mt-1 block text-[9px] uppercase tracking-[0.18em] text-paper/70">{category.count}</small>
                      </span>
                      <span className="label text-paper/60">0{index + 1}</span>
                    </span>
                  </button>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Produits */}
        <section id="essentiels" className="px-5 py-24 sm:px-8 sm:py-32">
          <div className="mx-auto max-w-[1600px]">
            <Reveal className="mb-10 flex flex-wrap items-end justify-between gap-8">
              <div>
                <Eyebrow>02 — Le vestiaire féminin</Eyebrow>
                <SectionTitle>Les silhouettes<br /><em className="text-terra">du moment.</em></SectionTitle>
              </div>
              <div className="no-scrollbar flex max-w-full gap-2 overflow-x-auto pb-1" role="group" aria-label="Filtrer les pièces">
                {FILTERS.map((item) => (
                  <button
                    key={item}
                    type="button"
                    onClick={() => setFilter(item)}
                    aria-pressed={filter === item}
                    className={`whitespace-nowrap rounded-full border px-4 py-2 text-[10px] font-bold uppercase tracking-[0.14em] transition-all duration-300 ${
                      filter === item
                        ? "border-teal bg-teal text-paper"
                        : "border-border text-olive hover:border-terra hover:text-terra"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </Reveal>

            <div className="grid grid-cols-1 gap-x-5 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {visibleProducts.map((product, index) => (
                <Reveal key={product.id} delay={(index % 4) * 80}>
                  <ProductCard
                    product={product}
                    onAdd={addToCart}
                    favorite={favorites.includes(product.id)}
                    onToggleFavorite={toggleFavorite}
                  />
                </Reveal>
              ))}
            </div>

            <Reveal className="mt-14 flex justify-center">
              <button
                type="button"
                onClick={() => setFilter("Tout")}
                className="group flex items-center gap-3 border-b border-teal pb-2 label transition-colors hover:border-terra hover:text-terra"
              >
                Voir toute la collection
                <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
              </button>
            </Reveal>
          </div>
        </section>

        {/* Exclusivité Homme — pièces présentées uniquement ici */}
        <section id="exclusivite-homme" className="grain relative overflow-hidden bg-teal px-5 py-24 text-paper sm:px-8 sm:py-32">
          <div aria-hidden className="pointer-events-none absolute -left-32 top-1/4 size-[420px] rounded-full bg-terra/20 blur-[140px]" />
          <div className="relative z-10 mx-auto max-w-[1600px]">
            <div className="grid items-center gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:gap-20">
              <Reveal>
                <Eyebrow light>03 — Exclusivité Homme</Eyebrow>
                <SectionTitle light>Deux pièces.<br /><em className="text-sand">Un privilège.</em></SectionTitle>
                <p className="mt-8 max-w-[420px] text-sm leading-[1.9] text-paper/70">
                  Le vestiaire masculin d'Awena ne s'expose pas : il se découvre.
                  Deux kanzus aux broderies dorées, réservés aux initiés.
                </p>
                <div className="mt-9 flex flex-wrap items-center gap-4">
                  <span className="inline-flex items-center gap-2 border border-sand/50 px-4 py-3 text-[10px] font-bold uppercase tracking-[0.18em] text-sand">
                    <Lock className="size-3.5" strokeWidth={1.5} />
                    Accès privilégié
                  </span>
                  <span className="label text-paper/45">Édition confidentielle</span>
                </div>
              </Reveal>

              <div className="grid gap-5 sm:grid-cols-2">
                {MEN_PRODUCTS.map((product, index) => (
                  <Reveal key={product.id} delay={index * 120} className="bg-paper p-3 sm:p-4">
                    <ProductCard
                      product={product}
                      onAdd={addToCart}
                      favorite={favorites.includes(product.id)}
                      onToggleFavorite={toggleFavorite}
                    />
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Manifeste */}
        <section id="histoire" className="grain relative overflow-hidden bg-rust text-paper">
          <div className="mx-auto grid max-w-[1600px] items-center lg:grid-cols-2">
            <div className="relative z-10 px-6 py-24 sm:px-10 lg:py-32 xl:px-20">
              <Eyebrow light>04 — Notre engagement</Eyebrow>
              <SectionTitle light>
                Moins de pièces.<br /><em className="text-sand">Plus de sens.</em>
              </SectionTitle>
              <p className="mt-8 max-w-[440px] text-sm leading-[1.9] text-paper/80">
                Chaque vêtement est pensé pour traverser les saisons : des coupes
                intemporelles, des teintures naturelles et une production en petits
                ateliers européens. Acheter moins, mais choisir mieux.
              </p>
              <div className="mt-10 flex flex-wrap items-center gap-8">
                <a
                  href="#essentiels"
                  className="inline-flex h-12 items-center gap-3 bg-paper px-6 text-[10px] font-bold uppercase tracking-[0.18em] text-teal transition-colors hover:bg-sand"
                >
                  Découvrir la collection <ArrowRight className="size-4" />
                </a>
                <span className="font-display text-4xl text-sand/70">“</span>
              </div>
            </div>
            <div className="relative min-h-[420px] lg:min-h-[720px]">
              <img
                src="/produits/robe-terracotta.jpg"
                alt="Robe terracotta portée en extérieur"
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-top"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-rust/50 via-transparent to-transparent" />
            </div>
          </div>
        </section>

        {/* Newsletter */}
        <section className="grain relative overflow-hidden bg-teal px-5 py-24 text-paper sm:px-8 sm:py-28">
          <div className="relative z-10 mx-auto grid max-w-[1600px] items-center gap-12 lg:grid-cols-[1fr_1fr]">
            <Reveal>
              <Eyebrow light>05 — La lettre</Eyebrow>
              <SectionTitle light>Un mot,<br /><em className="text-sand">une saison.</em></SectionTitle>
            </Reveal>
            <Reveal delay={120}>
              <p className="max-w-[420px] text-sm leading-relaxed text-paper/70">
                Nouveautés, conseils d'entretien et invitations atelier.
                Une lettre par mois, pas plus.
              </p>
              <form
                className="mt-7 flex max-w-[520px] flex-col gap-3 sm:flex-row"
                onSubmit={(event) => {
                  event.preventDefault()
                  if (!email.trim()) return
                  setSubscribed(true)
                  setToast("Merci ! Votre inscription est confirmée.")
                  setEmail("")
                }}
              >
                <label htmlFor="newsletter-email" className="sr-only">Votre adresse e-mail</label>
                <input
                  id="newsletter-email"
                  type="email"
                  required
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="votre@email.fr"
                  className="h-13 min-w-0 flex-1 border-b border-paper/50 bg-transparent px-0 py-3 text-sm text-paper outline-none transition-colors placeholder:text-paper/40 focus:border-sand"
                />
                <button
                  type="submit"
                  className="flex h-12 items-center justify-center gap-2 bg-sand px-6 text-[10px] font-bold uppercase tracking-[0.18em] text-teal transition-colors hover:bg-paper"
                >
                  {subscribed ? <Check className="size-4" /> : null}
                  {subscribed ? "Inscrit" : "S'inscrire"}
                </button>
              </form>
              <p className="mt-4 text-[10px] text-paper/45">En vous inscrivant, vous acceptez de recevoir notre lettre. Désinscription en un clic.</p>
            </Reveal>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-[#0B2A34] text-paper">
        <div className="mx-auto max-w-[1600px] px-5 pb-10 pt-20 sm:px-8">
          <div className="grid gap-12 pb-16 sm:grid-cols-2 lg:grid-cols-[1.4fr_repeat(3,1fr)]">
            <div>
              <a href="#accueil" className="font-display text-xl font-semibold tracking-[0.22em]">
                AW<span className="text-sand">ENA</span>
              </a>
              <p className="mt-5 max-w-[280px] text-[13px] leading-relaxed text-paper/65">
                Un vestiaire conscient, ancré dans les matières et les saisons.
              </p>
              <div className="mt-7 flex items-center gap-4">
                <a href="#accueil" aria-label="Instagram" className="grid size-9 place-items-center rounded-full border border-paper/25 transition-colors hover:border-sand hover:text-sand">
                  <Instagram className="size-4" strokeWidth={1.4} />
                </a>
                <span className="label text-paper/40">@awena</span>
              </div>
            </div>
            {[
              { title: "Boutique", links: ["Femme", "Homme", "Cérémonie", "Broderies"] },
              { title: "Aide", links: ["Livraison & retours", "Guide des tailles", "Contact", "FAQ"] },
              { title: "Maison", links: ["Notre histoire", "Savoir-faire", "Engagements"] },
            ].map((column) => (
              <div key={column.title} className="flex flex-col gap-3">
                <h4 className="label mb-2 text-sand">{column.title}</h4>
                {column.links.map((link) => (
                  <a
                    key={link}
                    href={link === "Notre histoire" || link === "Engagements" ? "#histoire" : "#essentiels"}
                    className="text-[13px] text-paper/70 transition-colors hover:text-paper"
                  >
                    {link}
                  </a>
                ))}
              </div>
            ))}
          </div>

          <div className="flex flex-wrap items-center justify-between gap-4 border-t border-paper/15 pt-7 text-[10px] uppercase tracking-[0.1em] text-paper/50">
            <span>© 2026 Awena — Maquette de démonstration</span>
            <div className="flex items-center gap-6">
              <span>France · EUR €</span>
              <button
                type="button"
                onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                className="flex items-center gap-2 text-paper/70 transition-colors hover:text-sand"
              >
                Retour en haut <ArrowUp className="size-3.5" />
              </button>
            </div>
          </div>
        </div>
      </footer>

      {/* Flottants */}
      <button
        type="button"
        aria-label="Retour en haut"
        onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
        className={`fixed bottom-6 right-6 z-50 grid size-11 place-items-center rounded-full border border-border bg-paper/90 text-teal shadow-lg backdrop-blur transition-all duration-500 hover:bg-teal hover:text-paper ${
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <ArrowUp className="size-4" />
      </button>

      <div
        role="status"
        aria-live="polite"
        className={`fixed bottom-6 left-1/2 z-[80] flex -translate-x-1/2 items-center gap-3 bg-teal px-5 py-3 text-xs text-paper shadow-xl transition-all duration-300 ${
          toast ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        }`}
      >
        <Check className="size-4 text-sand" />
        {toast}
      </div>

      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} onAdd={addToCart} />
      <CartDrawer
        open={cartOpen}
        lines={cart}
        onClose={() => setCartOpen(false)}
        onQty={changeQty}
        onRemove={(id) => setCart((lines) => lines.filter((line) => line.id !== id))}
        onCheckout={() => {
          setCartOpen(false)
          setToast("Commande de démonstration — merci !")
        }}
      />
    </div>
  )
}
