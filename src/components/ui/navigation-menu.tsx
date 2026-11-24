"use client"

import * as React from "react"
import { motion, useMotionValueEvent, useScroll, type Variants } from "motion/react"
import { Menu, Navigation } from "lucide-react"

import { cn } from "@/lib/utils"

export type NavItem = {
  name: string
  href: string
}

const DEFAULT_ITEMS: NavItem[] = [
  { name: "Collections", href: "#collections" },
  { name: "Essentiels", href: "#essentiels" },
  { name: "Histoire", href: "#histoire" },
]

const EXPAND_SCROLL_THRESHOLD = 80

const containerVariants: Variants = {
  expanded: {
    y: 0,
    opacity: 1,
    width: "auto",
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
  collapsed: {
    y: 0,
    opacity: 1,
    width: "3rem",
    transition: {
      type: "spring",
      damping: 20,
      stiffness: 300,
      when: "afterChildren",
      staggerChildren: 0.05,
      staggerDirection: -1,
    },
  },
}

const logoVariants: Variants = {
  expanded: { opacity: 1, x: 0, rotate: 0, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -25, rotate: -180, transition: { duration: 0.3 } },
}

const itemVariants: Variants = {
  expanded: { opacity: 1, x: 0, scale: 1, transition: { type: "spring", damping: 15 } },
  collapsed: { opacity: 0, x: -20, scale: 0.95, transition: { duration: 0.2 } },
}

const collapsedIconVariants: Variants = {
  expanded: { opacity: 0, scale: 0.8, transition: { duration: 0.2 } },
  collapsed: {
    opacity: 1,
    scale: 1,
    transition: {
      type: "spring",
      damping: 15,
      stiffness: 300,
      delay: 0.15,
    },
  },
}

type AnimatedNavFramerProps = {
  items?: NavItem[]
  className?: string
}

export function AnimatedNavFramer({ items = DEFAULT_ITEMS, className }: AnimatedNavFramerProps) {
  const [isExpanded, setExpanded] = React.useState(true)

  const { scrollY } = useScroll()
  const lastScrollY = React.useRef(0)
  const scrollPositionOnCollapse = React.useRef(0)

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = lastScrollY.current

    if (isExpanded && latest > previous && latest > 150) {
      setExpanded(false)
      scrollPositionOnCollapse.current = latest
    } else if (
      !isExpanded &&
      latest < previous &&
      scrollPositionOnCollapse.current - latest > EXPAND_SCROLL_THRESHOLD
    ) {
      setExpanded(true)
    }

    lastScrollY.current = latest
  })

  const handleNavClick = (event: React.MouseEvent<HTMLElement>) => {
    if (!isExpanded) {
      event.preventDefault()
      setExpanded(true)
    }
  }

  return (
    <motion.nav
      aria-label="Navigation principale"
      initial={{ y: -80, opacity: 0 }}
      animate={isExpanded ? "expanded" : "collapsed"}
      variants={containerVariants}
      whileHover={!isExpanded ? { scale: 1.1 } : {}}
      whileTap={!isExpanded ? { scale: 0.95 } : {}}
      onClick={handleNavClick}
      tabIndex={isExpanded ? undefined : 0}
      onKeyDown={(event) => {
        if (!isExpanded && (event.key === "Enter" || event.key === " ")) {
          event.preventDefault()
          setExpanded(true)
        }
      }}
      className={cn(
        "relative flex h-12 shrink-0 cursor-pointer items-center overflow-hidden rounded-full border bg-background/80 shadow-lg backdrop-blur-sm",
        !isExpanded && "justify-center",
        className,
      )}
    >
      <motion.div
        variants={logoVariants}
        className="flex shrink-0 items-center pl-4 pr-2 font-semibold text-terra"
      >
        <Navigation className="size-5" />
      </motion.div>

      <motion.div
        className={cn("flex items-center gap-1 pr-4 sm:gap-4", !isExpanded && "pointer-events-none")}
      >
        {items.map((item) => (
          <motion.a
            key={item.name}
            href={item.href}
            variants={itemVariants}
            onClick={(event) => event.stopPropagation()}
            className="label whitespace-nowrap px-2 py-1 text-teal/75 transition-colors hover:text-terra"
          >
            {item.name}
          </motion.a>
        ))}
      </motion.div>

      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <motion.div variants={collapsedIconVariants} animate={isExpanded ? "expanded" : "collapsed"}>
          <Menu className="size-5 text-terra" />
        </motion.div>
      </div>
    </motion.nav>
  )
}

export default AnimatedNavFramer
