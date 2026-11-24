import { useEffect, useMemo, useRef, useState } from "react"
import { ArrowUpRight, Plus, Search, X } from "lucide-react"
import { formatPrice, PRODUCTS, type Product } from "@/lib/catalog"

type SearchOverlayProps = {
  open: boolean
  onClose: () => void
  onAdd: (product: Product) => void
}

const SUGGESTIONS = ["Robe", "Kanzu", "Cérémonie", "Broderies"]

export default function SearchOverlay({ open, onClose, onAdd }: SearchOverlayProps) {
  const [query, setQuery] = useState("")
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!open) return
    const timer = window.setTimeout(() => inputRef.current?.focus(), 80)
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => {
      window.clearTimeout(timer)
      window.removeEventListener("keydown", onKey)
    }
  }, [open, onClose])

  useEffect(() => {
    if (!open) setQuery("")
  }, [open])

  const results = useMemo(() => {
    const term = query.trim().toLowerCase()
    if (!term) return PRODUCTS.slice(0, 3)
    return PRODUCTS.filter((product) =>
      `${product.name} ${product.type} ${product.alt} ${product.badge ?? ""}`.toLowerCase().includes(term),
    )
  }, [query])

  return (
    <div className={`fixed inset-0 z-[65] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Fermer la recherche"
        onClick={onClose}
        className={`absolute inset-0 bg-teal/40 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <div
        role="dialog"
        aria-modal="true"
        aria-label="Rechercher un vêtement"
        className={`absolute inset-x-0 top-0 max-h-[92vh] overflow-y-auto bg-paper shadow-2xl transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-y-0 opacity-100" : "-translate-y-8 opacity-0"
        }`}
      >
        <div className="mx-auto max-w-[1200px] px-5 py-8 sm:px-8 sm:py-12">
          <div className="flex items-center justify-between">
            <p className="label text-terra">Recherche</p>
            <button
              type="button"
              onClick={onClose}
              aria-label="Fermer"
              className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-cream/60"
            >
              <X className="size-4" strokeWidth={1.5} />
            </button>
          </div>

          <div className="mt-6 flex items-center gap-4 border-b border-teal pb-4">
            <Search className="size-6 shrink-0 text-teal" strokeWidth={1.3} />
            <input
              ref={inputRef}
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Que recherchez-vous ?"
              aria-label="Votre recherche"
              className="w-full bg-transparent font-display text-3xl outline-none placeholder:text-border sm:text-5xl"
            />
          </div>

          <div className="mt-5 flex flex-wrap items-center gap-2">
            <span className="label mr-2 text-olive">Suggestions</span>
            {SUGGESTIONS.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setQuery(suggestion)}
                className="rounded-full border border-border px-3 py-1.5 text-[11px] text-olive transition-colors hover:border-terra hover:text-terra"
              >
                {suggestion}
              </button>
            ))}
          </div>

          <div className="mt-10">
            <p className="label mb-5 text-olive">
              {query.trim() ? `${results.length} résultat${results.length > 1 ? "s" : ""}` : "À découvrir"}
            </p>
            {results.length === 0 ? (
              <p className="py-8 font-display text-2xl text-olive">Aucune pièce trouvée. Essayez un autre mot.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-3">
                {results.slice(0, 6).map((product) => (
                  <div key={product.id} className="group flex items-center gap-4 border border-border/70 bg-card p-3">
                    <img src={product.image} alt={product.alt} className="size-20 object-cover object-top" />
                    <div className="min-w-0 flex-1">
                      <p className="label text-olive">{product.type}</p>
                      <p className="truncate font-display text-base">{product.name}</p>
                      <p className="mt-1 text-xs font-semibold">{formatPrice(product.price)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => onAdd(product)}
                      aria-label={`Ajouter ${product.name} au panier`}
                      className="grid size-8 shrink-0 place-items-center rounded-full bg-teal text-paper transition-colors hover:bg-terra"
                    >
                      <Plus className="size-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          <a href="#essentiels" onClick={onClose} className="mt-8 inline-flex items-center gap-2 label text-terra link-underline">
            Voir toute la sélection <ArrowUpRight className="size-3.5" />
          </a>
        </div>
      </div>
    </div>
  )
}
