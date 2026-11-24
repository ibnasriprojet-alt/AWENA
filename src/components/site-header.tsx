import { useEffect, useState } from "react"
import { ArrowUpRight, Menu, Search, ShoppingBag, UserRound, X } from "lucide-react"

const LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "Essentiels", href: "#essentiels" },
  { label: "Histoire", href: "#histoire" },
]

type SiteHeaderProps = {
  cartCount: number
  onOpenCart: () => void
  onOpenSearch: () => void
}

export default function SiteHeader({ cartCount, onOpenCart, onOpenSearch }: SiteHeaderProps) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener("scroll", onScroll, { passive: true })
    return () => window.removeEventListener("scroll", onScroll)
  }, [])

  useEffect(() => {
    if (!menuOpen) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") setMenuOpen(false)
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [menuOpen])

  return (
    <>
      <header
        className={`sticky top-0 z-40 border-b transition-all duration-500 ${
          scrolled
            ? "border-border/80 bg-paper/90 shadow-[0_10px_40px_-30px_rgba(15,51,64,0.6)] backdrop-blur-xl"
            : "border-transparent bg-paper/70 backdrop-blur-md"
        }`}
      >
        <div className="mx-auto flex h-[74px] max-w-[1600px] items-center justify-between gap-6 px-5 sm:px-8">
          <a href="#accueil" className="group flex items-center gap-3" aria-label="Awena — accueil">
            <span className="grid size-8 place-items-center border border-teal/30 text-terra transition-colors group-hover:border-terra">
              <span className="font-display text-sm leading-none">A</span>
            </span>
            <span className="flex flex-col leading-none">
              <span className="font-display text-base font-semibold tracking-[0.22em] sm:text-lg">
                AW<span className="text-terra">ENA</span>
              </span>
              <span className="mt-1 hidden text-[8px] tracking-[0.3em] text-olive sm:block">VESTIAIRE CONSCIENT</span>
            </span>
          </a>

          <nav className="hidden items-center gap-9 lg:flex" aria-label="Navigation principale">
            {LINKS.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="label relative py-2 text-teal/75 transition-colors hover:text-terra after:absolute after:bottom-0 after:left-0 after:h-px after:w-0 after:bg-terra after:transition-all after:duration-300 hover:after:w-full"
              >
                {link.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-0.5 sm:gap-1">
            <button
              type="button"
              aria-label="Rechercher"
              onClick={onOpenSearch}
              className="grid size-10 place-items-center rounded-full text-teal transition-colors hover:bg-cream/60 hover:text-terra"
            >
              <Search className="size-[18px]" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label="Mon compte"
              className="hidden size-10 place-items-center rounded-full text-teal transition-colors hover:bg-cream/60 hover:text-terra sm:grid"
            >
              <UserRound className="size-[18px]" strokeWidth={1.5} />
            </button>
            <button
              type="button"
              aria-label={`Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`}
              onClick={onOpenCart}
              className="relative grid size-10 place-items-center rounded-full text-teal transition-colors hover:bg-cream/60 hover:text-terra"
            >
              <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
              {cartCount > 0 && (
                <span className="absolute right-0.5 top-0.5 grid size-[17px] place-items-center rounded-full bg-terra text-[9px] font-bold text-paper">
                  {cartCount}
                </span>
              )}
            </button>
            <button
              type="button"
              aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
              aria-expanded={menuOpen}
              onClick={() => setMenuOpen((open) => !open)}
              className="grid size-10 place-items-center rounded-full text-teal transition-colors hover:bg-cream/60 lg:hidden"
            >
              {menuOpen ? <X className="size-5" strokeWidth={1.5} /> : <Menu className="size-5" strokeWidth={1.5} />}
            </button>
          </div>
        </div>

        <div
          inert={!menuOpen}
          className={`overflow-hidden border-t border-border/60 bg-paper transition-[max-height,opacity] duration-500 lg:hidden ${
            menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
          }`}
        >
          <nav className="mx-auto flex max-w-[1600px] flex-col px-5 py-4 sm:px-8" aria-label="Navigation mobile">
            {LINKS.map((link, index) => (
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="flex items-center justify-between border-b border-border/60 py-4 font-display text-2xl"
              >
                <span className="flex items-center gap-4">
                  <span className="label text-terra">0{index + 1}</span>
                  {link.label}
                </span>
                <ArrowUpRight className="size-4 text-olive" />
              </a>
            ))}
          </nav>
        </div>
      </header>
    </>
  )
}
