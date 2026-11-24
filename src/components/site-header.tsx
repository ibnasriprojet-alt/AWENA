import { useEffect, useState } from "react"
import { ArrowUpRight } from "lucide-react"

import AnimatedNavFramer from "@/components/ui/navigation-menu"

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
      <AnimatedNavFramer
        items={LINKS.map((link) => ({ name: link.label, href: link.href }))}
        cartCount={cartCount}
        onOpenCart={onOpenCart}
        onOpenSearch={onOpenSearch}
        menuOpen={menuOpen}
        onToggleMenu={() => setMenuOpen((open) => !open)}
      />

      <div
        inert={!menuOpen}
        className={`fixed left-1/2 top-[76px] z-40 w-[calc(100%-2rem)] max-w-sm -translate-x-1/2 rounded-2xl border border-teal/15 bg-paper/95 p-2 shadow-[0_24px_60px_-30px_rgba(15,51,64,0.55)] backdrop-blur-xl transition-all duration-300 sm:top-[88px] ${
          menuOpen ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
        }`}
      >
        <nav aria-label="Navigation du menu" className="flex flex-col">
          {LINKS.map((link, index) => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="flex items-center justify-between rounded-xl px-3 py-3 font-display text-xl transition-colors hover:bg-cream/70"
            >
              <span className="flex items-center gap-3">
                <span className="label text-terra">0{index + 1}</span>
                {link.label}
              </span>
              <ArrowUpRight className="size-4 text-olive" />
            </a>
          ))}
        </nav>
      </div>
    </>
  )
}
