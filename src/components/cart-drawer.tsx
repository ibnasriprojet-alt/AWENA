import { useEffect } from "react"
import { ArrowRight, Minus, Plus, ShoppingBag, X } from "lucide-react"
import { formatPrice, type Product } from "@/lib/catalog"

export type CartLine = Product & { qty: number }

type CartDrawerProps = {
  open: boolean
  lines: CartLine[]
  onClose: () => void
  onQty: (id: string, delta: number) => void
  onRemove: (id: string) => void
  onCheckout: () => void
}

export default function CartDrawer({ open, lines, onClose, onQty, onRemove, onCheckout }: CartDrawerProps) {
  const total = lines.reduce((sum, line) => sum + line.price * line.qty, 0)
  const remaining = Math.max(0, 120 - total)
  const count = lines.reduce((sum, line) => sum + line.qty, 0)

  useEffect(() => {
    if (!open) return
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose()
    }
    window.addEventListener("keydown", onKey)
    return () => window.removeEventListener("keydown", onKey)
  }, [open, onClose])

  return (
    <div className={`fixed inset-0 z-[70] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open} inert={!open}>
      <button
        type="button"
        tabIndex={open ? 0 : -1}
        aria-label="Fermer le panier"
        onClick={onClose}
        className={`absolute inset-0 bg-teal/40 backdrop-blur-sm transition-opacity duration-500 ${open ? "opacity-100" : "opacity-0"}`}
      />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Votre panier"
        className={`absolute right-0 top-0 flex h-full w-full max-w-[430px] flex-col bg-paper shadow-2xl transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-border px-6 py-6">
          <div>
            <p className="label text-terra">Votre sélection</p>
            <h2 className="mt-1 font-display text-2xl">Panier <span className="text-olive">({count})</span></h2>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fermer"
            className="grid size-10 place-items-center rounded-full border border-border transition-colors hover:bg-cream/60"
          >
            <X className="size-4" strokeWidth={1.5} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6">
          {lines.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center gap-4 text-center">
              <ShoppingBag className="size-10 text-sand" strokeWidth={1} />
              <p className="font-display text-2xl">Votre panier est vide</p>
              <p className="max-w-[240px] text-sm leading-relaxed text-olive">
                Quelques pièces choisies avec soin n'attendent que vous.
              </p>
              <button
                type="button"
                onClick={onClose}
                className="mt-2 border-b border-teal pb-1 text-[10px] font-bold uppercase tracking-[0.18em]"
              >
                Découvrir la collection
              </button>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {lines.map((line) => (
                <li key={line.id} className="flex gap-4 py-5">
                  <img src={line.image} alt={line.alt} className="size-20 shrink-0 object-cover object-top" />
                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p className="label text-olive">{line.type}</p>
                        <p className="mt-1 font-display text-base leading-tight">{line.name}</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemove(line.id)}
                        aria-label={`Retirer ${line.name}`}
                        className="text-olive transition-colors hover:text-terra"
                      >
                        <X className="size-4" strokeWidth={1.4} />
                      </button>
                    </div>
                    <div className="mt-auto flex items-end justify-between pt-3">
                      <div className="flex items-center border border-border">
                        <button
                          type="button"
                          onClick={() => onQty(line.id, -1)}
                          aria-label="Diminuer la quantité"
                          className="grid size-7 place-items-center transition-colors hover:bg-cream/60"
                        >
                          <Minus className="size-3" />
                        </button>
                        <span className="w-6 text-center text-xs">{line.qty}</span>
                        <button
                          type="button"
                          onClick={() => onQty(line.id, 1)}
                          aria-label="Augmenter la quantité"
                          className="grid size-7 place-items-center transition-colors hover:bg-cream/60"
                        >
                          <Plus className="size-3" />
                        </button>
                      </div>
                      <span className="text-sm font-semibold">{formatPrice(line.price * line.qty)}</span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        {lines.length > 0 && (
          <div className="border-t border-border px-6 py-6">
            <div className="mb-2 flex justify-between text-[10px] uppercase tracking-[0.12em] text-olive">
              <span>{remaining > 0 ? `Plus que ${formatPrice(remaining)} pour la livraison offerte` : "Livraison offerte"}</span>
              <span>{Math.min(100, Math.round((total / 120) * 100))}%</span>
            </div>
            <div className="h-1 bg-cream">
              <div className="h-full bg-terra transition-all duration-500" style={{ width: `${Math.min(100, (total / 120) * 100)}%` }} />
            </div>
            <div className="mt-5 flex items-center justify-between">
              <span className="label text-olive">Sous-total</span>
              <span className="font-display text-2xl">{formatPrice(total)}</span>
            </div>
            <button
              type="button"
              onClick={onCheckout}
              className="mt-4 flex h-12 w-full items-center justify-center gap-2 bg-teal text-[10px] font-bold uppercase tracking-[0.2em] text-paper transition-colors hover:bg-terra"
            >
              Passer commande <ArrowRight className="size-4" />
            </button>
            <p className="mt-3 text-center text-[10px] text-olive">Paiement sécurisé · Retours sous 30 jours</p>
          </div>
        )}
      </aside>
    </div>
  )
}
