import { Heart, Plus } from "lucide-react"
import { formatPrice, type Product } from "@/lib/catalog"

type ProductCardProps = {
  product: Product
  onAdd: (product: Product) => void
  favorite: boolean
  onToggleFavorite: (id: string) => void
}

export default function ProductCard({ product, onAdd, favorite, onToggleFavorite }: ProductCardProps) {
  return (
    <article className="group flex flex-col">
      <div className="relative aspect-[3/4] overflow-hidden bg-[#e8dac7]">
        <img
          src={product.image}
          alt={product.alt}
          loading="lazy"
          className="size-full object-cover object-top transition-transform duration-[1.1s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.06]"
        />

        {product.badge && (
          <span className="absolute left-3 top-3 bg-paper/95 px-2.5 py-1.5 text-[9px] font-bold uppercase tracking-[0.16em] text-teal backdrop-blur-sm">
            {product.badge}
          </span>
        )}

        <button
          type="button"
          aria-label={favorite ? `Retirer ${product.name} des favoris` : `Ajouter ${product.name} aux favoris`}
          aria-pressed={favorite}
          onClick={() => onToggleFavorite(product.id)}
          className="absolute right-3 top-3 grid size-9 place-items-center rounded-full bg-paper/90 text-teal backdrop-blur-sm transition-all hover:scale-110 hover:text-terra"
        >
          <Heart className={`size-4 transition-all ${favorite ? "fill-terra text-terra" : ""}`} strokeWidth={1.5} />
        </button>

        <button
          type="button"
          onClick={() => onAdd(product)}
          className="absolute inset-x-3 bottom-3 flex h-11 translate-y-2 items-center justify-center gap-2 bg-teal text-[10px] font-bold uppercase tracking-[0.18em] text-paper opacity-0 transition-all duration-300 hover:bg-terra group-hover:translate-y-0 group-hover:opacity-100 focus-visible:translate-y-0 focus-visible:opacity-100 max-lg:translate-y-0 max-lg:opacity-100"
        >
          <Plus className="size-3.5" strokeWidth={1.8} />
          Ajouter au panier
        </button>
      </div>

      <div className="mt-5 flex flex-1 flex-col border-t border-border/70 pt-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="label text-olive">{product.type}</p>
            <h3 className="mt-1.5 font-display text-xl leading-tight">{product.name}</h3>
          </div>
          <p className="whitespace-nowrap font-display text-base">{formatPrice(product.price)}</p>
        </div>
      </div>
    </article>
  )
}
