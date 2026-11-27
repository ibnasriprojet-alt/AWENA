"use client"

import * as React from "react"
import { motion, useMotionValueEvent, useScroll, type Variants } from "motion/react"
import { Menu, Search, ShoppingBag, UserRound, X } from "lucide-react"

import { cn } from "@/lib/utils"

export type NavItem = {
  name: string
  href: string
}

const DEFAULT_ITEMS: NavItem[] = [
  { name: "Collections", href: "#collections" },
  { name: "Essentiels", href: "#essentiels" },
  { name: "Exclusivité", href: "#exclusivite-homme" },
  { name: "Histoire", href: "#histoire" },
]

const EXPAND_SCROLL_THRESHOLD = 80

const containerVariants: Variants = {
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      y: { type: "spring", damping: 18, stiffness: 250 },
      opacity: { duration: 0.3 },
      type: "spring",
      damping: 20,
      stiffness: 300,
      staggerChildren: 0.07,
      delayChildren: 0.2,
    },
  },
  hidden: {
    y: -120,
    opacity: 0,
    transition: {
      type: "spring",
      damping: 22,
      stiffness: 320,
      when: "afterChildren",
      staggerChildren: 0.04,
      staggerDirection: -1,
    },
  },
}

const logoVariants: Variants = {
  visible: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  hidden: { opacity: 0, x: -20, rotate: -90, transition: { duration: 0.2 } },
}

const itemVariants: Variants = {
  visible: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  hidden: { opacity: 0, x: -14, scale: 0.95, transition: { duration: 0.2 } },
}

type AnimatedNavFramerProps = {
  items?: NavItem[]
  cartCount?: number
  onOpenCart?: () => void
  onOpenSearch?: () => void
  menuOpen?: boolean
  onToggleMenu?: () => void
  onHide?: () => void
  className?: string
}

export function AnimatedNavFramer({
  items = DEFAULT_ITEMS,
  cartCount = 0,
  onOpenCart,
  onOpenSearch,
  menuOpen = false,
  onToggleMenu,
  onHide,
  className,
}: AnimatedNavFramerProps) {
  const [visible, setVisible] = React.useState(true)
  const visibleRef = React.useRef(true)

  React.useEffect(() => {
    visibleRef.current = visible
  }, [visible])

  const { scrollY } = useScroll()
  const lastScrollY = React.useRef(0)
  const scrollPositionOnHide = React.useRef(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current

    if (visibleRef.current && latest > previous && latest > 150) {
      setVisible(false)
      scrollPositionOnHide.current = latest
      onHide?.()
    } else if (
      !visibleRef.current &&
      latest < previous &&
      scrollPositionOnHide.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setVisible(true)
    }

    lastScrollY.current = latest
  })

  const stop = (event: React.MouseEvent) => event.stopPropagation()

  const iconButton =
    "relative grid size-9 shrink-0 place-items-center rounded-full text-teal transition-colors hover:bg-cream/70 hover:text-terra"

  return (
    <div
      className={cn(
        "fixed left-1/2 top-4 z-50 max-w-[calc(100vw-2rem)] -translate-x-1/2 sm:top-6",
        className,
      )}
    >
      <motion.nav
        aria-label="Navigation principale"
        aria-hidden={!visible}
        inert={!visible}
        initial={{ y: -80, opacity: 0 }}
        animate={visible ? "visible" : "hidden"}
        variants={containerVariants}
        className={cn(
          "relative flex h-12 shrink-0 items-center overflow-hidden rounded-full border border-teal/15 bg-paper/85 shadow-[0_18px_50px_-28px_rgba(15,51,64,0.7)] backdrop-blur-xl",
          !visible && "pointer-events-none",
        )}
      >
        <motion.a
          href="#accueil"
          variants={logoVariants}
          onClick={stop}
          aria-label="Awena — accueil"
          className="flex shrink-0 items-center gap-2 pl-3 pr-1 sm:pl-4"
        >
          <span className="grid size-7 place-items-center border border-terra/40 text-terra">
            <span className="font-display text-xs leading-none">A</span>
          </span>
          <span className="whitespace-nowrap font-display text-sm font-semibold tracking-[0.2em]">
            AW<span className="text-terra">ENA</span>
          </span>
        </motion.a>

        <div className="hidden items-center gap-0.5 pr-1 sm:gap-2 md:flex">
          {items.map((item) => (
            <motion.a
              key={item.name}
              href={item.href}
              variants={itemVariants}
              onClick={stop}
              className="label whitespace-nowrap px-2 py-1 text-teal/75 transition-colors hover:text-terra"
            >
              {item.name}
            </motion.a>
          ))}
        </div>

        <motion.div variants={itemVariants} className="flex items-center gap-0.5 pr-1.5 sm:gap-1">
          <button
            type="button"
            aria-label="Rechercher"
            onClick={(event) => {
              stop(event)
              onOpenSearch?.()
            }}
            className={iconButton}
          >
            <Search className="size-[18px]" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label="Mon compte"
            onClick={stop}
            className={cn(iconButton, "hidden sm:grid")}
          >
            <UserRound className="size-[18px]" strokeWidth={1.5} />
          </button>
          <button
            type="button"
            aria-label={`Panier, ${cartCount} article${cartCount > 1 ? "s" : ""}`}
            onClick={(event) => {
              stop(event)
              onOpenCart?.()
            }}
            className={iconButton}
          >
            <ShoppingBag className="size-[18px]" strokeWidth={1.5} />
            {cartCount > 0 && (
              <span className="absolute right-0 top-0 grid size-[16px] place-items-center rounded-full bg-terra text-[9px] font-bold text-paper">
                {cartCount}
              </span>
            )}
          </button>
          <button
            type="button"
            aria-label={menuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={menuOpen}
            onClick={(event) => {
              stop(event)
              onToggleMenu?.()
            }}
            className={iconButton}
          >
            {menuOpen ? <X className="size-[18px]" strokeWidth={1.5} /> : <Menu className="size-[18px]" strokeWidth={1.5} />}
          </button>
        </motion.div>
      </motion.nav>
    </div>
  )
}

export default AnimatedNavFramer
